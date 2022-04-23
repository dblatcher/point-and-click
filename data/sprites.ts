import * as skinnerSprite from "./skinnerSprite";
import * as marioSprite from "./marioSprite";
import * as fireSprite from "./fireSprite";
import { Sprite } from "../src/lib/Sprite";

const skinner = new Sprite(skinnerSprite.data, skinnerSprite.sheets)
const mario = new Sprite(marioSprite.data, marioSprite.sheets)
const fire = new Sprite(fireSprite.data, fireSprite.sheets)


const sprites: { [index: string]: Sprite } = {
    skinner, mario, fire
}

export {
    sprites
}
