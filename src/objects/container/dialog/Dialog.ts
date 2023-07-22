export const DialogEvent = {
    OPEN: 'OPEN',
    CLOSE: 'CLOSE',
} as const

export type DialogEvent = (typeof DialogEvent)[keyof typeof DialogEvent]

export default class Dialog extends Phaser.GameObjects.Container implements IDialog {
    private panel: Phaser.GameObjects.Container
    private dimmer: Phaser.GameObjects.Rectangle | null

    private animTween: Phaser.Tweens.Tween | null
    private dimTween: Phaser.Tweens.Tween | null

    private dimAlpha: number

    constructor(scene: Phaser.Scene, config: DialogConfig) {
        super(scene, config.x, config.y)

        this.animTween = null
        this.dimTween = null

        // add dim background if config has dim set to true
        if (config.dim && config.dim > 0) {
            this.dimmer = scene.add.rectangle(
                0,
                0,
                scene.cameras.main.width,
                scene.cameras.main.height,
                0x000000,
                1
            )
            this.add(this.dimmer)

            this.dimmer.setAlpha(config.dim)
            this.dimAlpha = config.dim
        } else {
            this.dimmer = null
            this.dimAlpha = 0
        }

        this.panel = config.panel
        this.add(this.panel)

        let { zone } = config

        if (!zone) {
            zone = scene.make.zone({
                x: 0,
                y: 0,
                width: scene.cameras.main.width,
                height: scene.cameras.main.height,
            })
        }

        this.layout(zone)
    }

    open(): this {
        this.animTween?.stop()
        this.dimTween?.stop()

        const duration = 200

        const y = this.panel.y
        this.animTween = this.scene.add.tween({
            targets: this.panel,
            ease: 'Quad.easeOut',
            duration,
            y: { from: this.panel.y + 10, to: this.panel.y },
            alpha: 1,
            onStart: () => {
                this.show()
                this.emit(DialogEvent.OPEN)
            },
            onStop: () => {
                this.panel.y = y
            },
        })

        if (!this.dimmer) return this

        this.dimTween = this.scene.add.tween({
            targets: this.dimmer,
            ease: 'Quad.easeOut',
            duration,
            alpha: { from: 0, to: this.dimAlpha },
            onStop: () => {
                this.dimmer?.setAlpha(this.dimAlpha)
            },
        })

        return this
    }

    close(): this {
        this.animTween?.stop()
        this.dimTween?.stop()

        const duration = 200

        const y = this.panel.y
        this.animTween = this.scene.add.tween({
            targets: this.panel,
            ease: 'Quad.easeOut',
            duration,
            y: { from: this.panel.y, to: this.panel.y + 10 },
            alpha: 0,
            onComplete: () => {
                this.hide()
                this.panel.y = y
                this.emit(DialogEvent.CLOSE)
            },
            onStop: () => {
                this.panel.y = y
            },
        })

        if (!this.dimmer) return this

        this.dimTween = this.scene.add.tween({
            targets: this.dimmer,
            ease: 'Quad.easeOut',
            duration,
            alpha: { from: this.dimAlpha, to: 0 },
            onStart: () => {
                this.dimmer?.setAlpha(0)
            },
        })

        return this
    }

    show(): this {
        this.setAlpha(1)
        this.setVisible(true)

        return this
    }

    hide(): this {
        this.setAlpha(0)
        this.setVisible(false)

        return this
    }

    private layout(zone: Phaser.GameObjects.Zone): void {
        // center the dimmer to the middle of the zone
        if (this.dimmer) {
            Phaser.Display.Align.In.Center(this.dimmer, zone)
        }

        // align the panel to the center of the screen
        Phaser.Display.Align.In.Center(this.panel, zone)
    }
}
