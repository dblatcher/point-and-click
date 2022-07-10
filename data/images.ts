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

const characterSpritePath = "./assets/characters/"
const characterSpriteFileNames = [
    "mario.png",
    "skinner-1-l.png",
    "skinner-2-l.png",
    "skinner-1-r.png",
    "skinner-2-r.png",
]

const thingSpritePath = "./assets/things/"
const thingSpriteFileNames = [
    'bucket.png',
    'tube.png',
    'Fire.png',
]

const buildAssets = (filenames: string[], path: string, category: ImageAssetCategory): ImageAsset[] => (
    filenames.map(fileName => {
        return {
            id: fileName,
            href: path + fileName,
            category,
        }
    })
)

const itemAssets: ImageAsset[] = itemFileNames.map(fileName => {
    return {
        id: "ITEM_" + fileName,
        href: itemPath + fileName,
        category: 'item'
    }
})


export const assets: ImageAsset[] = [
    ...buildAssets(backgroundFileNames,backgroundPath,'background'),
    ...itemAssets,
    ...buildAssets(characterSpriteFileNames, characterSpritePath, 'spriteSheet'),
    ...buildAssets(thingSpriteFileNames, thingSpritePath, 'spriteSheet'),
]