import GameScreen from '@/objects/screen/GameScreen'
import PauseScreen from '@/objects/screen/PauseScreen'
import RunningScreen from '@/objects/screen/RunningScreen'
import MenuScreen from '@/objects/screen/StartScreen'
import { MenuScene } from './MenuScene'
import { GameScene } from './GameScene'
import GameOverScreen from '@/objects/screen/GameOverScreen'

export const GameState = {
    PAUSED: 'PAUSED',
    RUNNING: 'RUNNING',
    GAME_OVER: 'GAME_OVER',
    START_MENU: 'START_MENU',
} as const

export type GameState = (typeof GameState)[keyof typeof GameState]

export const GameEvent = {
    PAUSE: 'PAUSE',
    RESUME: 'RESUME',
    RESTART: 'RESTART',
    GAME_OVER: 'GAME_OVER',
    START: 'START',
    QUIT: 'QUIT',
} as const

export type GameEvent = (typeof GameEvent)[keyof typeof GameEvent]

export default class HUD extends Phaser.Scene {
    private state: GameState
    private huds!: { [key in GameState]: GameScreen }

    constructor(config?: Phaser.Types.Scenes.SettingsConfig) {
        super({
            ...config,
            key: 'HUD',
        })

        this.state = GameState.START_MENU
    }

    create() {
        this.huds = {
            [GameState.PAUSED]: new PauseScreen(this),
            [GameState.RUNNING]: new RunningScreen(this),
            [GameState.GAME_OVER]: new GameOverScreen(this), // placeholder
            [GameState.START_MENU]: new MenuScreen(this),
        }

        for (const hud in this.huds) {
            this.add.existing(this.huds[hud as GameState])
            this.stopHUD(hud as GameState)
        }

        this.startHUD(this.state)

        this.events.on(GameEvent.PAUSE, this.pause, this)
        this.events.on(GameEvent.RESUME, this.resume, this)
        this.events.on(GameEvent.RESTART, this.restart, this)
        this.events.on(GameEvent.GAME_OVER, this.gameOver, this)
        this.events.on(GameEvent.START, this.start, this)
        this.events.on(GameEvent.QUIT, this.quit, this)
    }

    getState() {
        return this.state
    }

    pause() {
        if (this.state !== GameState.RUNNING) {
            throw new Error('Cannot pause game when not running')
        }

        this.transition(GameState.RUNNING, GameState.PAUSED)

        // pause GameScene
        this.scene.pause('GameScene')
    }

    resume() {
        if (this.state !== GameState.PAUSED) {
            throw new Error('Cannot resume game when not paused')
        }

        this.transition(GameState.PAUSED, GameState.RUNNING)

        // resume GameScene
        this.scene.resume('GameScene')
    }

    restart() {
        if (this.state !== GameState.GAME_OVER) {
            throw new Error('Cannot restart game when not game over')
        }

        this.transition(GameState.GAME_OVER, GameState.RUNNING)

        // restart GameScene
        this.scene.get('GameScene').scene.restart()
    }

    gameOver() {
        if (this.state !== GameState.RUNNING) {
            throw new Error('Cannot game over when not running')
        }

        this.transition(GameState.RUNNING, GameState.GAME_OVER)

        // pause GameScene
        this.scene.pause('GameScene')
    }

    quit() {
        if (this.state !== GameState.PAUSED && this.state !== GameState.GAME_OVER) {
            throw new Error('Cannot quit game when not paused')
        }

        if (this.state === GameState.PAUSED) {
            this.transition(GameState.PAUSED, GameState.START_MENU)
        }

        if (this.state === GameState.GAME_OVER) {
            this.transition(GameState.GAME_OVER, GameState.START_MENU)
        }

        const gameScene = this.scene.get('GameScene') as GameScene

        // restart GameScene
        this.scene.get('GameScene').scene.transition({
            target: 'MenuScene',
            duration: 200,
            moveBelow: true,
            onUpdate: (progress: number) => {
                gameScene.cameras.main.setAlpha(1 - progress)
            },
        })
    }

    start() {
        if (this.state !== GameState.START_MENU) {
            throw new Error('Cannot start game when not in start menu')
        }

        this.transition(GameState.START_MENU, GameState.RUNNING)

        const menuScene = this.scene.get('MenuScene') as MenuScene

        // resume GameScene
        this.scene.get('MenuScene').scene.transition({
            target: 'GameScene',
            duration: 200,
            moveBelow: true,
            onUpdate: (progress: number) => {
                menuScene.cameras.main.setAlpha(1 - progress)
            },
        })
    }

    private startHUD(key: GameState) {
        this.huds[key].setActive(true).setVisible(true).setInteractive()
    }

    private stopHUD(key: GameState) {
        this.huds[key].setActive(false).setVisible(false).disableInteractive()
    }

    private transition(from: GameState, to: GameState) {
        this.startHUD(to)

        const transitions = Promise.all([
            this.huds[from].transitionOut(),
            this.huds[to].transitionIn(),
        ])
        transitions.then(() => {
            this.stopHUD(from)
            this.state = to
        })
    }
}
