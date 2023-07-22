import HUD from '@/scenes/HUD'

export type ScreenConfig = {
    zone?: Phaser.GameObjects.Zone
    x?: number
    y?: number
    children?: Phaser.GameObjects.GameObject[]
}

export default abstract class GameScreen extends Phaser.GameObjects.Container {
    protected zone: Phaser.GameObjects.Zone
    protected hud: HUD

    constructor(hud: HUD, config?: ScreenConfig) {
        let { zone, x, y, children } = config ?? {}

        zone =
            zone ??
            hud.make
                .zone({
                    x: 0,
                    y: 0,
                    width: hud.cameras.main.width,
                    height: hud.cameras.main.height,
                })
                .setPosition(hud.cameras.main.centerX, hud.cameras.main.centerY)

        x = x ?? 0
        y = y ?? 0
        children = children ?? []

        super(hud, x, y, children)

        this.zone = zone
        this.hud = hud
    }

    abstract transitionIn(): Promise<void>
    abstract transitionOut(): Promise<void>
}
