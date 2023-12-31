import { IBulletConstructor } from '@/interfaces/bullet.interface'

export default class Bullet extends Phaser.GameObjects.Image {
    body!: Phaser.Physics.Arcade.Body // defined in initImage()

    private bulletSpeed!: number // defined in initImage()

    constructor(aParams: IBulletConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture)

        this.rotation = aParams.rotation
        this.initImage()
        this.scene.add.existing(this)
    }

    private initImage(): void {
        // variables
        this.bulletSpeed = 1000

        // image
        this.setOrigin(0.5, 0.5)
        this.setDepth(2)

        // physics
        this.scene.physics.world.enable(this)
        this.scene.physics.velocityFromRotation(
            this.rotation - Math.PI / 2,
            this.bulletSpeed,
            this.body.velocity
        )
    }

    update(): void {
        //
    }
}
