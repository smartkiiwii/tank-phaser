export const ButtonCallbackType = {
    DOWN: 'button-down',
    UP: 'button-up',
    CLICK: 'button-click',
    OVER: 'button-hover',
    OUT: 'button-out',
} as const

export type ButtonCallbackType = (typeof ButtonCallbackType)[keyof typeof ButtonCallbackType]

export default class Button extends Phaser.GameObjects.Container {
    protected text: Phaser.GameObjects.Text | Phaser.GameObjects.BitmapText
    protected background: Phaser.GameObjects.NineSlice
    protected animTween: Phaser.Tweens.Tween | null

    constructor(scene: Phaser.Scene, config: ButtonConfig) {
        let { x, y } = config

        x = x ?? 0
        y = y ?? 0

        super(scene, x, y)

        this.background = config.background
        this.add(this.background)

        this.text = config.text
        this.add(this.text)

        this.animTween = null

        this.layout()
    }

    protected layout(): void {
        // center the background object
        this.background
            .setOrigin(0)
            .setPosition(-this.background.width / 2, -this.background.height / 2)

        const textOffsetX = this.text.x
        const textOffsetY = this.text.y

        // center the text object inside the background object
        Phaser.Display.Align.In.Center(this.text, this.background)

        // apply the text offset
        this.text.setPosition(this.text.x + textOffsetX, this.text.y + textOffsetY)

        this.width = this.background.width
        this.height = this.background.height

        // make the container interactive
        this.setInteractive({
            useHandCursor: true,
        })

        // listen for pointerdown events on the container
        this.on('pointerdown', () => {
            this.displayClick()
            this.emit(ButtonCallbackType.DOWN)
        })

        // listen for pointerup events on the container
        this.on('pointerup', () => {
            this.displayRest()
            this.emit(ButtonCallbackType.UP)
            this.emit(ButtonCallbackType.CLICK)
        })

        // listen for pointerover events on the container
        this.on('pointerover', () => {
            this.displayHover()
            this.emit(ButtonCallbackType.OVER)
        })

        // listen for pointerout events on the container
        this.on('pointerout', () => {
            this.displayRest()
            this.emit(ButtonCallbackType.OUT)
        })
    }

    private displayClick(): void {
        if (this.animTween?.isPlaying()) this.animTween.stop()

        this.animTween = this.scene.tweens.add({
            targets: this,
            scaleX: 0.9,
            scaleY: 0.9,
            duration: 100,
            ease: Phaser.Math.Easing.Sine.InOut,
        })
    }

    private displayHover(): void {
        if (this.animTween?.isPlaying()) this.animTween.stop()

        this.animTween = this.scene.tweens.add({
            targets: this,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 100,
            ease: Phaser.Math.Easing.Sine.InOut,
        })
    }

    private displayRest(): void {
        if (this.animTween?.isPlaying()) this.animTween.stop()

        this.animTween = this.scene.tweens.add({
            targets: this,
            scaleX: 1,
            scaleY: 1,
            duration: 100,
            ease: Phaser.Math.Easing.Sine.InOut,
        })
    }
}
