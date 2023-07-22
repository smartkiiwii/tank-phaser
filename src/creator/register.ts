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
        function (this: Phaser.GameObjects.GameObjectFactory, config: ButtonConfig) {
            return new Button(this.scene, config)
        }
    )
}

function registerPanel() {
    Phaser.GameObjects.GameObjectFactory.register(
        'panel',
        function (this: Phaser.GameObjects.GameObjectFactory, config: PanelConfig) {
            return new Panel(this.scene, config)
        }
    )
}

function registerDialog() {
    Phaser.GameObjects.GameObjectFactory.register(
        'dialog',
        function (this: Phaser.GameObjects.GameObjectFactory, config: DialogConfig) {
            return new Dialog(this.scene, config)
        }
    )
}
