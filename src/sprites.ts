import { sheetLeft, skinner as skinnerData } from "../data/skinnerSprite";
import { Sprite } from "./lib/Sprite";

const skinner = new Sprite(skinnerData, [sheetLeft])

const sprites: { [index: string]: Sprite } = {
    skinner
}

export {
    sprites
}