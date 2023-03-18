import { findById } from "../src/lib/util"
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


const imageAssets: ImageAsset[] = [
    ...buildAssets(backgroundFileNames, backgroundPath, 'background'),
    ...buildAssets(itemFileNames, itemPath, 'spriteSheet', 'ITEM_'),
    ...buildAssets(actorSpriteFileNames, actorSpritePath, 'spriteSheet'),
    ...buildAssets(thingSpriteFileNames, thingSpritePath, 'spriteSheet'),
]

const setFrameProperties = (id: string, props: Partial<ImageAsset>): void => {
    const asset = findById(id, imageAssets)
    if (!asset) {
        return
    }
    Object.assign(asset, props)
}

setFrameProperties('mario.png', { cols: 3, rows: 2 });
setFrameProperties("skinner-1-l.png", { cols: 12, rows: 1 });
setFrameProperties("skinner-1-r.png", { cols: 12, rows: 1 });
setFrameProperties("skinner-2-l.png", { cols: 5, rows: 1, widthScale:1.75 });
setFrameProperties("skinner-2-r.png", { cols: 5, rows: 1, widthScale:1.75 });
setFrameProperties("Fire.png", { cols: 4, rows: 2 });


export { imageAssets };