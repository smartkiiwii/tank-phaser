import 'phaser'
import { GameConfig } from './config'
import Button from './objects/container/button/Button'

Phaser.GameObjects.GameObjectFactory.register(
    'button',
    function (this: Phaser.GameObjects.GameObjectFactory, config: ButtonConfig) {
        const button = new Button(this.scene, config)

        this.displayList.add(button)

        return button
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
