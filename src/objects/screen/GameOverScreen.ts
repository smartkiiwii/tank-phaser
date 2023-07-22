import HUD, { GameEvent } from '@/scenes/HUD'
import { DialogEvent } from '../container/dialog/Dialog'
import GameScreen from './GameScreen'
import { ButtonCallbackType } from '../container/button/Button'
import { GameScene } from '@/scenes/GameScene'
import { loadPlayerData, setPlayerData } from '../player/PlayerData'

export default class GameOverScreen extends GameScreen {
    private gameOverMenu: IDialog
    private score: number
    private highscoreText: Phaser.GameObjects.Text

    constructor(hud: HUD) {
        super(hud)

        const gameScene = hud.scene.get('GameScene') as GameScene

        // score text
        this.score = 0
        const scoreText = hud.make.text({
            x: 0,
            y: 0,
            text: 'Score: 0',
            style: {
                font: 'bold 20px Arial',
                color: '#000000',
                align: 'center',
            },
        })

        this.add(scoreText)

        // highscore text
        const playerData = loadPlayerData()
        this.highscoreText = hud.make.text({
            x: 0,
            y: 0,
            text: `Highscore: ${playerData.highscore}`,
            style: {
                font: 'bold 20px Arial',
                color: '#000000',
                align: 'center',
            },
        })

        this.add(this.highscoreText)

        gameScene.events.on('scoreChange', (score: number) => {
            this.score = score
            scoreText.setText(`Score: ${score.toString()}`)
        })

        const retryButton = hud.make.button({
            text: hud.make.bitmapText({
                x: 0,
                y: 3,
                text: 'Retry',
                font: 'font',
                scale: 0.3,
            }),
            background: hud.make.nineslice({
                x: 0,
                y: 0,
                key: 'ui',
                frame: 'button-blue',
                width: 100,
                height: 50,
                leftWidth: 5,
                rightWidth: 5,
                topHeight: 5,
                bottomHeight: 5,
            }),
        })

        const returnToMenuButton = hud.make.button({
            text: hud.make.bitmapText({
                x: 0,
                y: 3,
                text: 'Quit',
                font: 'font',
                scale: 0.3,
            }),
            background: hud.make.nineslice({
                x: 0,
                y: 0,
                key: 'ui',
                frame: 'button-blue',
                width: 100,
                height: 50,
                leftWidth: 5,
                rightWidth: 5,
                topHeight: 5,
                bottomHeight: 5,
            }),
        })

        this.gameOverMenu = hud.make
            .dialog({
                x: 0,
                y: 0,
                dim: 0.4,
                zone: this.zone,
                panel: hud.make.panel({
                    x: 0,
                    y: 0,
                    padding: 20,
                    spacing: 10,
                    title: hud.make.bitmapText({
                        x: 0,
                        y: 0,
                        text: 'Game Over',
                        font: 'font',
                        scale: 0.5,
                    }),
                    background: hud.make.nineslice({
                        x: 0,
                        y: 0,
                        key: 'ui',
                        frame: 'panel-blue',
                        width: 300,
                        height: 200,
                        leftWidth: 10,
                        rightWidth: 10,
                        topHeight: 10,
                        bottomHeight: 10,
                    }),
                    children: [scoreText, this.highscoreText, retryButton, returnToMenuButton],
                }),
            })
            .hide()

        this.add(this.gameOverMenu)

        retryButton.on(ButtonCallbackType.CLICK, () => {
            hud.events.emit(GameEvent.RESTART)
        })

        returnToMenuButton.on(ButtonCallbackType.CLICK, () => {
            hud.events.emit(GameEvent.QUIT)
        })
    }

    transitionIn(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const playerData = loadPlayerData()
                let highscore = playerData.highscore

                if (this.score > highscore) {
                    highscore = this.score
                    setPlayerData('SET_HIGHSCORE', this.score)
                }

                this.highscoreText.setText(`Highscore: ${highscore}`)

                this.gameOverMenu.once(DialogEvent.OPEN, () => {
                    resolve()
                })

                this.gameOverMenu.open()
            } catch (error) {
                reject(error)
            }
        })
    }
    transitionOut(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.gameOverMenu.once(DialogEvent.CLOSE, () => {
                    resolve()
                })

                this.gameOverMenu.close()
            } catch (error) {
                reject(error)
            }
        })
    }
}
