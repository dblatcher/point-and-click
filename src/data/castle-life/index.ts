import { GameDesign } from "point-click-lib";
import game from "./game.json"
import images from "./imageAssets.json"
import sounds from "./soundAssets.json"
import { FileAsset, ImageAsset, SoundAsset } from "@/services/assets";

const gameDesign: GameDesign = game as unknown as GameDesign;


const toImageCategory = (input?: string): ImageAsset['category'] => {
    switch (input) {
        case "item":
        case "background":
        case "spriteSheet":
        case "any":
            return input;
        default:
            return 'any'
    }
}
const populateImageAsset = (raw: FileAsset): ImageAsset => ({
    ...raw,
    href: `./assets/castle/images/${raw.id}`,
    category: toImageCategory(raw.category)
});

const toSoundCategory = (input?: string): SoundAsset['category'] => {
    switch (input) {
        case "sfx":
        case "music":
            return input;
        default:
            return 'sfx'
    }
}
const populateSoundAsset = (raw: FileAsset): SoundAsset => ({
    ...raw,
    href: `./assets/castle/sounds/${raw.id}`,
    category: toSoundCategory(raw.category)
});


const imageAssets: ImageAsset[] = images.map(populateImageAsset)
const soundAssets: SoundAsset[] = sounds.map(populateSoundAsset)

export {
    gameDesign, imageAssets, soundAssets
}