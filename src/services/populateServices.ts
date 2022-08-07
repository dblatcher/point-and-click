import imageService from "./imageService";
import spriteService from "./spriteService";
import spriteSheetService from "./spriteSheetService";
import { Sprite } from "../lib/Sprite";
import { assets } from "../../data/images";
import { prebuiltGameDesign } from "../../data/fullGame";


export function populateServicesForPreBuiltGame(): void {
    const sprites = prebuiltGameDesign.sprites.map(data => new Sprite(data))
    console.log('populating services')
    spriteService.add(sprites)
    spriteSheetService.add(prebuiltGameDesign.spriteSheets)
    imageService.add(assets)
}
