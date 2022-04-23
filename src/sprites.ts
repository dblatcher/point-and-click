import * as skinnerSprite from "../data/skinnerSprite";
import * as marioSprite from "../data/marioSprite";
import { Sprite } from "./lib/Sprite";

const skinner = new Sprite(skinnerSprite.data, skinnerSprite.sheets)
const mario = new Sprite(marioSprite.data, marioSprite.sheets)


const sprites: { [index: string]: Sprite } = {
    skinner, mario
}

export {
    sprites
}
