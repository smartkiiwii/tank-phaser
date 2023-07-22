import HUD, { GameEvent } from '@/scenes/HUD'
import { ButtonCallbackType } from '../container/button/Button'
import GameScreen from './GameScreen'

export default class RunningScreen extends GameScreen {
    private pauseButton: Phaser.GameObjects.Container

    constructor(hud: HUD) {
        const pauseButton = hud.make.button({
            text: hud.make.bitmapText({
                x: 0,
                y: 3,
                text: 'Pause',
                font: 'font',
                scale: 0.3,
            }),
            background: hud.make.nineslice({
                x: 0,
                y: 0,
                key: 'ui',
                frame: 'button-blue',
                width: 90,
                height: 50,
                leftWidth: 5,
                rightWidth: 5,
                topHeight: 5,
                bottomHeight: 5,
            }),
        })

        super(hud, {
            children: [pauseButton],
        })

        this.pauseButton = pauseButton

        Phaser.Display.Align.In.TopLeft(pauseButton, this.zone, -10, -10)

        pauseButton.on(ButtonCallbackType.CLICK, () => {
            this.hud.events.emit(GameEvent.PAUSE)
        })
    }

    transitionIn(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                // fade in while moving from -10, -10 to 0, 0
                this.hud.add.tween({
                    targets: this.pauseButton,
                    x: { from: this.pauseButton.x - 10, to: this.pauseButton.x },
                    y: { from: this.pauseButton.y - 10, to: this.pauseButton.y },
                    alpha: { from: 0, to: 1 },
                    duration: 100,
                    onComplete: () => {
                        resolve()
                    },
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    transitionOut(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                // fade out while moving from 0, 0 to -10, -10
                const ogX = this.pauseButton.x
                const ogY = this.pauseButton.y

                this.hud.add.tween({
                    targets: this.pauseButton,
                    x: { from: this.pauseButton.x, to: this.pauseButton.x - 10 },
                    y: { from: this.pauseButton.y, to: this.pauseButton.y - 10 },
                    alpha: { from: 1, to: 0 },
                    duration: 100,
                    onComplete: () => {
                        this.pauseButton.x = ogX
                        this.pauseButton.y = ogY

                        resolve()
                    },
                })
            } catch (error) {
                reject(error)
            }
        })
    }
}
