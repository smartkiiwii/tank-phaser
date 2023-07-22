import { loadPlayerData } from '@/objects/player/PlayerData'

export class BootScene extends Phaser.Scene {
    private loadingBar!: Phaser.GameObjects.Graphics // defined in createLoadingGraphics()
    private progressBar!: Phaser.GameObjects.Graphics // defined in createLoadingGraphics()

    constructor() {
        super({
            key: 'BootScene',
        })
    }

    preload(): void {
        // set the background, create the loading and progress bar
        this.cameras.main.setBackgroundColor(0x7cbe3a)
        this.createLoadingGraphics()

        // pass value to change the loading bar fill
        this.load.on(
            'progress',
            (value: number) => {
                this.progressBar.clear()
                this.progressBar.fillStyle(0x88e453, 1)
                this.progressBar.fillRect(
                    this.cameras.main.width / 4,
                    this.cameras.main.height / 2 - 16,
                    (this.cameras.main.width / 2) * value,
                    16
                )
            },
            this
        )

        // delete bar graphics, when loading complete
        this.load.on(
            'complete',
            () => {
                this.progressBar.destroy()
                this.loadingBar.destroy()
            },
            this
        )

        // load our package
        this.load.pack('preload', './assets/pack.json', 'preload')
    }

    init() {
        // apply mute setting
        const playerData = loadPlayerData()
        this.sound.setMute(playerData.preferences.mute)
    }

    create() {
        this.scene.launch('HUD')
    }

    update(): void {
        this.scene.start('MenuScene')
    }

    private createLoadingGraphics(): void {
        this.loadingBar = this.add.graphics()
        this.loadingBar.fillStyle(0xffffff, 1)
        this.loadingBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        )
        this.progressBar = this.add.graphics()
    }
}
