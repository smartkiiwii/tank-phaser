export default class Panel extends Phaser.GameObjects.Container implements IPanel {
    private spacing: number
    private padding: number
    private title: Phaser.GameObjects.Text | Phaser.GameObjects.BitmapText
    private divider: Phaser.GameObjects.NineSlice
    private childrenObjs: GameObjectWithSize[]
    private background: Phaser.GameObjects.NineSlice

    private animTween: Phaser.Tweens.Tween | null

    constructor(scene: Phaser.Scene, config: PanelConfig) {
        let { x, y } = config

        x = x ?? 0
        y = y ?? 0

        super(scene, x, y)

        this.spacing = config.spacing ?? 0
        this.padding = config.padding ?? 0

        this.animTween = null

        this.background = config.background
        this.add(this.background)

        this.title = config.title
        this.add(this.title)

        // add the divider to seperate the title and the panel
        this.divider = scene.make.nineslice({
            x: 0,
            y: 0,
            key: 'ui',
            frame: 'divider-horizontal',
            width: 10,
            height: 10,
            leftWidth: 10,
            rightWidth: 10,
        })
        this.add(this.divider)

        this.childrenObjs = config.children
        this.add(this.childrenObjs)

        this.layout()
    }

    show(): this {
        this.setAlpha(1)
        this.setVisible(true)
        return this
    }

    hide(): this {
        this.setAlpha(0)
        this.setVisible(false)
        return this
    }

    open(): this {
        this.animTween?.stop()
        const y = this.y
        this.animTween = this.scene.add.tween({
            targets: this,
            ease: 'Quad.easeOut',
            duration: 200,
            y: { from: this.y + 10, to: this.y },
            alpha: 1,
            onStart: () => {
                this.show()
            },
            onStop: () => {
                this.y = y
            },
        })

        return this
    }

    close(): this {
        this.animTween?.stop()
        const y = this.y
        this.animTween = this.scene.add.tween({
            targets: this,
            ease: 'Quad.easeOut',
            duration: 200,
            y: { from: this.y, to: this.y + 10 },
            alpha: 0,
            onComplete: () => {
                this.hide()
                this.y = y
            },
            onStop: () => {
                this.y = y
            },
        })

        return this
    }

    private layout(): void {
        // resize the background to fit the children's max width
        const maxWidth =
            Math.max(...this.childrenObjs.map((child) => child.width), this.title.width) +
            this.padding * 2

        // resize the background to fit all the children's height plus padding and spacing
        const maxHeight =
            this.childrenObjs.reduce((acc, child) => acc + child.height + this.spacing, 0) +
            this.padding * 2 -
            this.spacing

        // reposition the background and resize it
        this.background
            .setOrigin(0)
            .setPosition(-maxWidth / 2, -maxHeight / 2)
            .setSize(maxWidth, maxHeight)

        // resize the divider to fit 2/3 the background's width
        this.divider.setSize((maxWidth * 2) / 3, 10)

        // reposition the title to the top center of the background, offset by 25px
        Phaser.Display.Align.To.TopCenter(this.title, this.background, 0, 25)

        // reposition the divider to the bottom center of the title
        Phaser.Display.Align.To.BottomCenter(this.divider, this.title)

        // reposition the children using a for loop
        let currentY = this.padding
        for (const child of this.childrenObjs) {
            // reposition the child in the left center of the background, offset by the padding
            Phaser.Display.Align.In.TopCenter(child, this.background, 0, -currentY)

            // increment the currentY by the child's height plus the spacing
            currentY += child.height + this.spacing
        }
    }
}
