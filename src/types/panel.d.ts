interface IPanel extends Phaser.GameObjects.Container {
    /**
     * Open the panel by playing the open animation
     */
    open(): this

    /**
     * Close the panel by playing the close animation
     */
    close(): this

    /**
     * Hide the panel immediately by setting the panel's visible property to false
     */
    hide(): this

    /**
     * Show the panel immediately by setting the panel's visible property to true
     */
    show(): this
}

type GameObjectWithSize = Phaser.GameObjects.GameObject & {
    width: number
    height: number
}

type PanelConfig = {
    x?: number
    y?: number

    /**
     * The title of the panel object
     * */
    title: Phaser.GameObjects.Text | Phaser.GameObjects.BitmapText

    /**
     * The children inside the panel
     * */
    children: GameObjectWithSize[]

    /**
     * The background of the panel
     * */
    background: Phaser.GameObjects.NineSlice

    /**
     * Spacing between the children
     * */
    spacing?: number

    /**
     * Padding of the panel
     * */
    padding?: number
}
