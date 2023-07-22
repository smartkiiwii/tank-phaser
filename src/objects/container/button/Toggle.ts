import Button, { ButtonCallbackType } from './Button'

export const ToggleCallbackType = {
    TOGGLE: 'toggle',
} as const

export type ToggleCallbackType = (typeof ToggleCallbackType)[keyof typeof ToggleCallbackType]

export default class Toggle extends Button implements IToggle {
    private toggle: Phaser.GameObjects.Image
    private toggled: boolean
    private activeKey: string
    private inactiveKey: string

    constructor(scene: Phaser.Scene, config: ToggleConfig) {
        // backup text offset
        const textOffset = {
            x: config.text.x,
            y: config.text.y,
        }

        super(scene, config)

        let { padding } = config
        padding = padding ?? 10

        this.toggle = scene.make.image({
            x: 0,
            y: 0,
            key: 'ui',
            frame: config.inactiveKey,
            scale: 1.2,
        })
        this.add(this.toggle)

        // center toggle and text, toggle to the left, text to the right, offseted by their combined width
        Phaser.Display.Align.In.LeftCenter(this.toggle, this.background, -padding)
        Phaser.Display.Align.In.RightCenter(this.text, this.background, -padding)

        // restore text offset
        this.text.setPosition(this.text.x + textOffset.x, this.text.y + textOffset.y)

        this.on(ButtonCallbackType.CLICK, () => {
            this.setToggled(!this.toggled)
        })

        this.toggled = false
        this.activeKey = config.activeKey
        this.inactiveKey = config.inactiveKey
    }

    public setToggled(toggled = true): void {
        this.toggled = toggled
        if (toggled) {
            this.toggle.setFrame(this.activeKey)
        } else {
            this.toggle.setFrame(this.inactiveKey)
        }

        this.emit(ToggleCallbackType.TOGGLE, toggled)
    }
}
