import HUD, { GameEvent } from '@/scenes/HUD'
import GameScreen from './GameScreen'
import { ButtonCallbackType } from '../container/button/Button'
import { ToggleCallbackType } from '../container/button/Toggle'
import { PlayerDataActions, loadPlayerData, setPlayerData } from '../player/PlayerData'

export default class MenuScreen extends GameScreen {
    private menu: IPanel
    private muteButton: IToggle

    constructor(hud: HUD) {
        const startButton = hud.make.button({
            text: hud.make.bitmapText({
                x: 0,
                y: 3,
                text: 'Start',
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

        startButton.on(ButtonCallbackType.CLICK, () => {
            hud.events.emit(GameEvent.START)
        })

        // mute button
        const muteButton = hud.make.toggle({
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

        muteButton.on(ToggleCallbackType.TOGGLE, (toggled: boolean) => {
            this.hud.sound.setMute(toggled)
            setPlayerData(PlayerDataActions.SET_MUTE, toggled)
        })

        const panel = hud.make.panel({
            x: 0,
            y: 0,
            padding: 20,
            spacing: 10,
            title: hud.make.bitmapText({
                x: 0,
                y: 0,
                text: 'TANK',
                font: 'font',
                scale: 1,
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
            children: [startButton, muteButton],
        })

        super(hud, {
            children: [panel],
        })

        this.menu = panel
        this.muteButton = muteButton

        Phaser.Display.Align.In.Center(panel, this.zone, 0, 50)
    }
    transitionIn(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                // apply mute settings
                const playerData = loadPlayerData()
                this.muteButton.setToggled(playerData.preferences.mute)

                this.hud.add.tween({
                    targets: this.menu,
                    y: { from: this.menu.y - 10, to: this.menu.y },
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
                this.hud.add.tween({
                    targets: this.menu,
                    y: { from: this.menu.y, to: this.menu.y + 10 },
                    alpha: { from: 1, to: 0 },
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
}
