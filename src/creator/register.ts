import Button from '@/objects/container/button/Button'
import Dialog from '@/objects/container/dialog/Dialog'
import Panel from '@/objects/container/panel/Panel'

export default function register() {
    registerButton()
    registerPanel()
    registerDialog()
}

function registerButton() {
    Phaser.GameObjects.GameObjectCreator.register(
        'button',
        function (this: Phaser.GameObjects.GameObjectCreator, config: ButtonConfig) {
            return new Button(this.scene, config)
        }
    )
}

function registerPanel() {
    Phaser.GameObjects.GameObjectCreator.register(
        'panel',
        function (this: Phaser.GameObjects.GameObjectCreator, config: PanelConfig) {
            return new Panel(this.scene, config)
        }
    )
}

function registerDialog() {
    Phaser.GameObjects.GameObjectCreator.register(
        'dialog',
        function (this: Phaser.GameObjects.GameObjectCreator, config: DialogConfig) {
            return new Dialog(this.scene, config)
        }
    )
}
