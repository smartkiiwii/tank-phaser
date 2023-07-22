import Button from '@/objects/container/button/Button'
import Dialog from '@/objects/container/dialog/Dialog'
import Panel from '@/objects/container/panel/Panel'

export default function register() {
    registerButton()
    registerPanel()
    registerDialog()
}

function registerButton() {
    Phaser.GameObjects.GameObjectFactory.register(
        'button',
        function (this: Phaser.GameObjects.GameObjectFactory, config: ButtonConfig) {
            const button = new Button(this.scene, config)

            this.displayList.add(button)

            return button
        }
    )
}

function registerPanel() {
    Phaser.GameObjects.GameObjectFactory.register(
        'panel',
        function (this: Phaser.GameObjects.GameObjectFactory, config: PanelConfig) {
            const panel = new Panel(this.scene, config)

            this.displayList.add(panel)

            return panel
        }
    )
}

function registerDialog() {
    Phaser.GameObjects.GameObjectFactory.register(
        'dialog',
        function (this: Phaser.GameObjects.GameObjectFactory, config: DialogConfig) {
            const dialog = new Dialog(this.scene, config)

            this.displayList.add(dialog)

            return dialog
        }
    )
}
