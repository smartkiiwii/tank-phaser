import HUD, { GameEvent } from '@/scenes/HUD'
import { DialogEvent } from '../container/dialog/Dialog'
import GameScreen from './GameScreen'
import { ButtonCallbackType } from '../container/button/Button'
import { ToggleCallbackType } from '../container/button/Toggle'
import { PlayerDataActions, loadPlayerData, setPlayerData } from '../player/PlayerData'
import { GameScene } from '@/scenes/GameScene'

export default class PauseScreen extends GameScreen {
    private pauseMenu: IDialog
    private muteButton: IToggle

    constructor(hud: HUD) {
        super(hud)

        const resumeButton = hud.make.button({
            text: hud.make.bitmapText({
                x: 0,
                y: 3,
                text: 'Resume',
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

        // mute button
        this.muteButton = hud.make.toggle({
            x: 0,
            y: 0,
            text: hud.make.bitmapText({
                x: 0,
                y: 3,
                text: 'Mute',
                font: 'font',
                scale: 0.3,
            }),
            background: hud.make.nineslice({
                x: 0,
                y: 0,
                key: 'ui',
                frame: 'button-blue',
                width: 120,
                height: 50,
                leftWidth: 5,
                rightWidth: 5,
                topHeight: 5,
                bottomHeight: 5,
            }),
            activeKey: 'toggle-blue',
            inactiveKey: 'toggle-off',
            padding: 20,
        })

        this.muteButton.on(ToggleCallbackType.TOGGLE, (toggled: boolean) => {
            const gameScene = this.hud.scene.get('GameScene') as GameScene
            this.hud.sound.setMute(toggled)
            gameScene.sound.setMute(toggled)
            setPlayerData(PlayerDataActions.SET_MUTE, toggled)
        })

        this.pauseMenu = hud.make
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
                        text: 'Paused',
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
                    children: [resumeButton, this.muteButton, returnToMenuButton],
                }),
            })
            .hide()

        this.add(this.pauseMenu)

        resumeButton.on(ButtonCallbackType.CLICK, () => {
            hud.events.emit(GameEvent.RESUME)
        })

        returnToMenuButton.on(ButtonCallbackType.CLICK, () => {
            hud.events.emit(GameEvent.QUIT)
        })
    }

    transitionIn(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                // apply mute settings
                const playerData = loadPlayerData()
                this.muteButton.setToggled(playerData.preferences.mute)

                this.pauseMenu.once(DialogEvent.OPEN, () => {
                    resolve()
                })

                this.pauseMenu.open()
            } catch (error) {
                reject(error)
            }
        })
    }
    transitionOut(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.pauseMenu.once(DialogEvent.CLOSE, () => {
                    resolve()
                })

                this.pauseMenu.close()
            } catch (error) {
                reject(error)
            }
        })
    }
}
