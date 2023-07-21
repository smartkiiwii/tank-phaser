type ButtonText = Phaser.GameObjects.Text | Phaser.GameObjects.BitmapText
type ButtonBackground = Phaser.GameObjects.Rectangle | Phaser.GameObjects.Image | Phaser.GameObjects.Sprite | Phaser.GameObjects.NineSlice | Phaser.GameObjects.TileSprite

type ButtonConfig = {
    x?: number
    y?: number

    /**
     * The text object
     * */
    text: ButtonText

    /**
     * The background object
     */
    background: ButtonBackground
}
