import * as skinnerSprite from "./skinnerSprite";
import * as marioSprite from "./marioSprite";
import * as fireSprite from "./fireSprite";
import * as tubeSprite from "./tubeSprite";
import { SpriteData, SpriteSheet } from "src/definitions/SpriteSheet";

export const spriteInputs: { data: SpriteData; sheets: SpriteSheet[] }[] = [
    skinnerSprite,
    marioSprite,
    fireSprite,
    tubeSprite,
]
