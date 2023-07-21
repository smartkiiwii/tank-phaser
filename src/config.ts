import { BootScene } from './scenes/BootScene'
import { GameScene } from './scenes/GameScene'
import { MenuScene } from './scenes/MenuScene'

export const GameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Tank',
    url: 'https://github.com/digitsensitive/phaser3-typescript',
    version: '2.0',
    width: 1600,
    height: 1200,
    scale: {
        mode: Phaser.Scale.RESIZE,
    },
    zoom: 0.6,
    type: Phaser.AUTO,
    parent: 'game',
    scene: [BootScene, MenuScene, GameScene],
    input: {
        keyboard: true,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    backgroundColor: '#000000',
    render: { pixelArt: false, antialias: true },
}
