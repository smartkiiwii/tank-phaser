import HUD, { GameEvent } from './HUD'

export class MenuScene extends Phaser.Scene {
    private startKey!: Phaser.Input.Keyboard.Key // defined in init()
    private bitmapTexts: Phaser.GameObjects.BitmapText[]

    constructor() {
        super({
            key: 'MenuScene',
        })

        this.bitmapTexts = []
    }

    init(): void {
        if (!this.input.keyboard) {
            throw new Error('Keyboard not found')
        }

        this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.startKey.isDown = false
    }

    create(): void {
        // bg
        this.add
            .rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x7cbe3a)
            .setOrigin(0, 0)
    }

    update(): void {
        if (this.startKey.isDown) {
            const hud = this.scene.get('HUD') as HUD
            hud.events.emit(GameEvent.RESUME)
            this.scene.start('GameScene')
        }
    }
}
