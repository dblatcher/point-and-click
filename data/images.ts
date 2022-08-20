import { ImageAsset, ImageAssetCategory } from "src/services/imageService"

const backgroundPath = "./assets/backgrounds/"
const backgroundFileNames = [
    "square-room.png",
    "hill.png",
    "indoors.png",
    "sky.png",
    "trees.png",
]

const itemPath = "./assets/things/"
const itemFileNames = [
    'bucket.png',
    'tube.png',
]

const actorSpritePath = "./assets/characters/"
const actorSpriteFileNames = [
    "mario.png",
    "skinner-1-l.png",
    "skinner-2-l.png",
    "skinner-1-r.png",
    "skinner-2-r.png",
    "boy.png",
]

const thingSpritePath = "./assets/things/"
const thingSpriteFileNames = [
    'bucket.png',
    'tube.png',
    'Fire.png',
]

const buildAssets = (filenames: string[], path: string, category: ImageAssetCategory, idPrefix?: string): ImageAsset[] => (
    filenames.map(fileName => {
        return {
            id: `${idPrefix || ''}${fileName}`,
            href: path + fileName,
            category,
        }
    })
)


export const assets: ImageAsset[] = [
    ...buildAssets(backgroundFileNames, backgroundPath, 'background'),
    ...buildAssets(itemFileNames, itemPath, 'spriteSheet', 'ITEM_'),
    ...buildAssets(actorSpriteFileNames, actorSpritePath, 'spriteSheet'),
    ...buildAssets(thingSpriteFileNames, thingSpritePath, 'spriteSheet'),
]