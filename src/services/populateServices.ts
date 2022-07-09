import imageService from "./imageService";
import spriteService from "./spriteService";
import spriteSheetService from "./spriteSheetService";
import { Sprite } from "../lib/Sprite";
import { spriteInputs } from "../../data/sprites";
import { assets } from "../../data/images";

//TO DO - should be using startingGameCondition instead of spriteInputs?

export function populate(): void {
    const sprites = spriteInputs.map(input => new Sprite(input.data))
    const spriteSheets = spriteInputs.flatMap(input => input.sheets)
    spriteService.add(sprites)
    spriteSheetService.add(spriteSheets)
    imageService.add(assets)
    console.log('populating services')
}
