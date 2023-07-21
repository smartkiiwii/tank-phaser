import Bullet from '../bullet/Bullet'
import { IImageConstructor } from '@/interfaces/image.interface'

const HANDLING = 0.05

export default class Player extends Phaser.GameObjects.Image {
    body!: Phaser.Physics.Arcade.Body // defined in initImage()

    // variables
    private health!: number // defined in initImage()
    private lastShoot!: number // defined in initImage()
    private speed!: number // defined in initImage()

    // children
    private barrel!: Phaser.GameObjects.Image // defined in initImage()
    private lifeBar!: Phaser.GameObjects.Graphics // defined in initImage()

    // game objects
    private bullets!: Phaser.GameObjects.Group // defined in initImage()

    // input
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys // defined in initImage()
    private shootingKey!: Phaser.Input.Pointer // defined in initImage()

    public getBullets(): Phaser.GameObjects.Group {
        return this.bullets
    }

    constructor(aParams: IImageConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

        this.initImage()
        this.scene.add.existing(this)
    }

    private initImage() {
        // variables
        this.health = 1
        this.lastShoot = 0
        this.speed = 100

        // image
        this.setOrigin(0.5, 0.5)
        this.setDepth(0)
        this.angle = 180

        this.barrel = this.scene.add.image(this.x, this.y, 'barrelBlue')
        this.barrel.setOrigin(0.5, 1)
        this.barrel.setDepth(1)
        this.barrel.angle = 180

        this.lifeBar = this.scene.add.graphics()
        this.redrawLifebar()

        // game objects
        this.bullets = this.scene.add.group({
            /*classType: Bullet,*/
            active: true,
            maxSize: 10,
            runChildUpdate: true,
        })

        // input
        if (!this.scene.input.keyboard) {
            throw new Error('Keyboard not found')
        }

        this.cursors = this.scene.input.keyboard.createCursorKeys()
        this.shootingKey = this.scene.input.mousePointer

        // physics
        this.scene.physics.world.enable(this)
    }

    update(): void {
        if (this.active) {
            this.barrel.x = this.x
            this.barrel.y = this.y
            this.lifeBar.x = this.x
            this.lifeBar.y = this.y
            this.handleInput()
            this.handleShooting()
        } else {
            this.destroy()
            this.barrel.destroy()
            this.lifeBar.destroy()
        }
    }

    private handleInput() {
        // move barrel towards mouse position
        const mousePosition = {
            x: this.scene.input.mousePointer.x + this.scene.cameras.main.scrollX,
            y: this.scene.input.mousePointer.y + this.scene.cameras.main.scrollY,
        }

        this.barrel.rotation =
            Phaser.Math.Angle.BetweenPoints(this.barrel, mousePosition) + Math.PI / 2

        // handle movement
        const targetDirection = {
            x: 0,
            y: 0,
        }

        if (this.cursors.up.isDown) {
            targetDirection.y = -1
        }

        if (this.cursors.down.isDown) {
            targetDirection.y = 1
        }

        if (this.cursors.left.isDown) {
            targetDirection.x = -1
        }

        if (this.cursors.right.isDown) {
            targetDirection.x = 1
        }

        if (targetDirection.x === 0 && targetDirection.y === 0) {
            this.body.setVelocity(0, 0)
            return
        }

        const targetRotation = Math.atan2(targetDirection.y, targetDirection.x)

        // small corrections with (- MATH.PI / 2) to align tank correctly
        const currRotation = this.rotation - Math.PI / 2

        const diffFromCurr = Phaser.Math.Angle.Wrap(targetRotation - currRotation)

        // if the difference is closer to the current rotation, move forward, else move backwards
        if (Math.abs(diffFromCurr) < (Math.PI / 3) * 2) {
            this.scene.physics.velocityFromRotation(currRotation, this.speed, this.body.velocity)

            // rotate tank towards the target rotation by a small amount
            this.rotation += diffFromCurr * HANDLING
        } else {
            this.scene.physics.velocityFromRotation(currRotation, -this.speed, this.body.velocity)

            // rotate tank's rear towards the target rotation by a small amount
            const diffFromCurrRear = Phaser.Math.Angle.Wrap(targetRotation - currRotation - Math.PI)
            this.rotation += diffFromCurrRear * HANDLING
        }
    }

    private handleShooting(): void {
        if (this.shootingKey.isDown && this.scene.time.now > this.lastShoot) {
            this.scene.cameras.main.shake(20, 0.005)
            this.scene.tweens.add({
                targets: this,
                props: { alpha: 0.8 },
                delay: 0,
                duration: 5,
                ease: 'Power1',
                easeParams: null,
                hold: 0,
                repeat: 0,
                repeatDelay: 0,
                yoyo: true,
                paused: false,
            })

            if (this.bullets.getLength() < 10) {
                this.bullets.add(
                    new Bullet({
                        scene: this.scene,
                        rotation: this.barrel.rotation,
                        x: this.barrel.x,
                        y: this.barrel.y,
                        texture: 'bulletBlue',
                    })
                )

                this.scene.sound.play('bulletFire', {volume: 0.1})

                this.lastShoot = this.scene.time.now + 80
            }
        }
    }

    private redrawLifebar(): void {
        this.lifeBar.clear()
        this.lifeBar.fillStyle(0xe66a28, 1)
        this.lifeBar.fillRect(-this.width / 2, this.height / 2, this.width * this.health, 15)
        this.lifeBar.lineStyle(2, 0xffffff)
        this.lifeBar.strokeRect(-this.width / 2, this.height / 2, this.width, 15)
        this.lifeBar.setDepth(1)
    }

    public updateHealth(): void {
        if (this.health > 0) {
            this.health -= 0.05
            this.redrawLifebar()
        } else {
            this.scene.sound.play('tankExplode', {volume: 1})
            this.health = 0
            this.active = false
            this.scene.scene.start('MenuScene')
        }
    }
}
