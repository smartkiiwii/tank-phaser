declare namespace Phaser.GameObjects {
    interface GameObjectFactory {
        button(config: ButtonConfig): Phaser.GameObjects.Container
        toggle(config: ToggleConfig): IToggle
        panel(config: PanelConfig): IPanel
        dialog(config: DialogConfig): IDialog
    }

    interface GameObjectCreator {
        button(config: ButtonConfig): Phaser.GameObjects.Container
        toggle(config: ToggleConfig): IToggle
        panel(config: PanelConfig): IPanel
        dialog(config: DialogConfig): IDialog
    }
}
