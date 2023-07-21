import 'phaser'
import { GameConfig } from './config'
import Button from './objects/container/button/Button'
import Panel from './objects/container/panel/Panel'
import Dialog from './objects/container/dialog/Dialog'

Phaser.GameObjects.GameObjectFactory.register(
    'button',
    function (this: Phaser.GameObjects.GameObjectFactory, config: ButtonConfig) {
        const button = new Button(this.scene, config)

        this.displayList.add(button)

        return button
    }
)

Phaser.GameObjects.GameObjectFactory.register(
    'panel',
    function (this: Phaser.GameObjects.GameObjectFactory, config: PanelConfig) {
        const panel = new Panel(this.scene, config)

        this.displayList.add(panel)

        return panel
    }
)

Phaser.GameObjects.GameObjectFactory.register(
    'dialog',
    function (this: Phaser.GameObjects.GameObjectFactory, config: DialogConfig) {
        const dialog = new Dialog(this.scene, config)

        this.displayList.add(dialog)

        return dialog
    }
)

export class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config)
    }
}

window.addEventListener('load', () => {
    const game = new Game(GameConfig)
})
