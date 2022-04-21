import * as skinnerSprite from "../data/skinnerSprite";
import { Sprite } from "./lib/Sprite";

const skinner = new Sprite(skinnerSprite.data, skinnerSprite.sheets)

const sprites: { [index: string]: Sprite } = {
    skinner
}

export {
    sprites
}
