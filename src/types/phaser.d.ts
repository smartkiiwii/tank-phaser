declare namespace Phaser.GameObjects {
    interface GameObjectFactory {
        button(config: ButtonConfig): Phaser.GameObjects.Container
        panel(config: PanelConfig): IPanel
        dialog(config: DialogConfig): IDialog
    }
}
