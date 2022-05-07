import * as skinnerSprite from "./skinnerSprite";
import * as marioSprite from "./marioSprite";
import * as fireSprite from "./fireSprite";
import * as tubeSprite from "./tubeSprite";
import { Sprite } from "../../src/lib/Sprite";

const skinner = new Sprite(skinnerSprite.data, skinnerSprite.sheets)
const mario = new Sprite(marioSprite.data, marioSprite.sheets)
const fire = new Sprite(fireSprite.data, fireSprite.sheets)
const tube = new Sprite(tubeSprite.data, tubeSprite.sheets)


const sprites: Record<string, Sprite> = {
    skinner, mario, fire, tube
}

export {
    sprites
}
