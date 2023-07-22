import 'phaser'
import { GameConfig } from './config'
import registerFactory from './factory/register'
import registerCreator from './creator/register'

registerFactory()
registerCreator()

export class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config)
    }
}

window.addEventListener('load', () => {
    const game = new Game(GameConfig)
})
