interface IDialog extends Phaser.GameObjects.Container {
    /**
     * Open the dialog by playing the open animation
     */
    open(): this

    /**
     * Close the dialog by playing the close animation
     */
    close(): this

    /**
     * Hide the dialog immediately by setting the dialog's visible property to false
     */
    hide(): this

    /**
     * Show the dialog immediately by setting the dialog's visible property to true
     */
    show(): this
}

type GameObjectWithSize = Phaser.GameObjects.GameObject & {
    width: number
    height: number
}

type DialogConfig = {
    x?: number
    y?: number

    /**
     * The panel of the dialog object
     */
    panel: Phaser.GameObjects.Container

    /**
     * Whether or not the dialog dims the background
     */
    dim?: number

    /**
     * Screen zone to layout the dialog
     */
    zone?: Phaser.GameObjects.Zone
}
