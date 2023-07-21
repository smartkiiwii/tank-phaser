import Player from '@/objects/player/Player'
import Enemy from '@/objects/enemy/Enemy'
import Obstacle from '@/objects/obstacles/obstacle'
import Bullet from '@/objects/bullet/Bullet'

export class GameScene extends Phaser.Scene {
    private map!: Phaser.Tilemaps.Tilemap // defined in create()
    private tileset!: Phaser.Tilemaps.Tileset // defined in create()
    private layer!: Phaser.Tilemaps.TilemapLayer // defined in create()

    private player!: Player // defined in create()
    private enemies!: Phaser.GameObjects.Group // defined in create()
    private obstacles!: Phaser.GameObjects.Group // defined in create()

    private target!: Phaser.Math.Vector2 // defined in create()

    constructor() {
        super({
            key: 'GameScene',
        })
    }

    init(): void {
        //
    }

    create(): void {
        // create tilemap from tiled JSON
        this.map = this.make.tilemap({ key: 'levelMap' })

        const tileset = this.map.addTilesetImage('tiles')

        if (!tileset) {
            throw new Error('Tileset not found')
        }

        const layer = this.map.createLayer('tileLayer', tileset, 0, 0)

        if (!layer) {
            throw new Error('Layer not found')
        }

        this.tileset = tileset
        this.layer = layer
        this.layer.setCollisionByProperty({ collide: true })

        this.obstacles = this.add.group({
            /*classType: Obstacle,*/
            runChildUpdate: true,
        })

        this.enemies = this.add.group({
            /*classType: Enemy*/
        })
        this.convertObjects()

        // collider layer and obstacles
        this.physics.add.collider(this.player, this.layer)
        this.physics.add.collider(this.player, this.obstacles)

        // collider for bullets
        this.physics.add.collider(
            this.player.getBullets(),
            this.layer,
            this.bulletHitLayer,
            undefined,
            this
        )

        this.physics.add.collider(
            this.player.getBullets(),
            this.obstacles,
            this.bulletHitObstacles,
            undefined,
            this
        )

        this.enemies.children.iterate((enemy: Phaser.GameObjects.GameObject) => {
            if (!enemy) {
                return false
            }

            if (!(enemy instanceof Enemy)) {
                throw new Error('Enemy is not instance of Enemy')
            }

            this.physics.add.overlap(
                this.player.getBullets(),
                enemy,
                this.playerBulletHitEnemy,
                undefined,
                this
            )
            this.physics.add.overlap(enemy.getBullets(), this.player, this.enemyBulletHitPlayer)

            this.physics.add.collider(enemy.getBullets(), this.obstacles, this.bulletHitObstacles)
            this.physics.add.collider(enemy.getBullets(), this.layer, this.bulletHitLayer)

            return true
        }, this)

        this.cameras.main.startFollow(this.player)
    }

    update(): void {
        this.player.update()

        this.enemies.children.iterate((enemy: Phaser.GameObjects.GameObject) => {
            if (!enemy) {
                return false
            }

            if (!(enemy instanceof Enemy)) {
                throw new Error('Enemy is not instance of Enemy')
            }

            enemy.update()
            if (this.player.active && enemy.active) {
                const angle = Phaser.Math.Angle.Between(
                    enemy.body.x,
                    enemy.body.y,
                    this.player.body.x,
                    this.player.body.y
                )

                enemy.getBarrel().angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG
            }

            return true
        }, this)
    }

    private convertObjects(): void {
        // find the object layer in the tilemap named 'objects'
        const layer = this.map.getObjectLayer('objects')

        if (!layer) {
            throw new Error('Layer not found')
        }

        const objects = layer.objects

        objects.forEach((object) => {
            if (object.type === 'player') {
                this.player = new Player({
                    scene: this,
                    x: object.x ?? 0,
                    y: object.y ?? 0,
                    texture: 'tankBlue',
                })
            } else if (object.type === 'enemy') {
                const enemy = new Enemy({
                    scene: this,
                    x: object.x ?? 0,
                    y: object.y ?? 0,
                    texture: 'tankRed',
                })

                this.enemies.add(enemy)
            } else {
                const obstacle = new Obstacle({
                    scene: this,
                    x: object.x ?? 0,
                    y: object.y ?? 0 - 40,
                    texture: object.type,
                })

                this.obstacles.add(obstacle)
            }
        })
    }

    private bulletHitLayer(
        bullet: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
    ): void {
        if (!(bullet instanceof Bullet)) {
            throw new Error('Bullet is not instance of Bullet')
        }

        bullet.destroy()
    }

    private bulletHitObstacles(
        bullet: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
        obstacle: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
    ): void {
        if (!(bullet instanceof Bullet)) {
            throw new Error('Bullet is not instance of Bullet')
        }

        if (!(obstacle instanceof Obstacle)) {
            throw new Error('Obstacle is not instance of Obstacle')
        }

        bullet.destroy()
    }

    private enemyBulletHitPlayer(
        bullet: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
        player: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
    ): void {
        if (!(bullet instanceof Bullet)) {
            throw new Error('Bullet is not instance of Bullet')
        }

        if (!(player instanceof Player)) {
            throw new Error('Player is not instance of Player')
        }

        bullet.destroy()
        player.updateHealth()
    }

    private playerBulletHitEnemy(
        bullet: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
        enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
    ): void {
        if (!(bullet instanceof Bullet)) {
            throw new Error('Bullet is not instance of Bullet')
        }

        if (!(enemy instanceof Enemy)) {
            throw new Error('Enemy is not instance of Enemy')
        }

        bullet.destroy()
        enemy.updateHealth()
    }
}
