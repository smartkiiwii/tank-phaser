interface IToggle extends Phaser.GameObjects.Container {
    setToggled(toggled: boolean): void
}

type ToggleConfig = ButtonConfig & {
    /**
     * The padding between the toggle and text against
     * the left/right-side of background
     */
    padding?: number

    /**
     * The key frame of the toggle when it is active
     */
    activeKey: string

    /**
     * The key frame of the toggle when it is inactive
     */
    inactiveKey: string
}
