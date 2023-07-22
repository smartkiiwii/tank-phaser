import HUD, { GameEvent } from '@/scenes/HUD'
import { DialogEvent } from '../container/dialog/Dialog'
import GameScreen from './GameScreen'
import { ButtonCallbackType } from '../container/button/Button'

export default class GameOverScreen extends GameScreen {
    private gameOverMenu: IDialog

    constructor(hud: HUD) {
        super(hud)

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
                    children: [retryButton, returnToMenuButton],
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
