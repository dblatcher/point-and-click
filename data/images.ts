import { ImageAsset } from "src/services/imageService"

const backgroundPath = "./assets/backgrounds/"
const backgroundFileNames = [
    "square-room.png",
    "hill.png",
    "indoors.png",
    "sky.png",
    "trees.png",
]

const bgAssets: ImageAsset[] = backgroundFileNames.map(fileName => {
    return {
        id: fileName,
        href: backgroundPath + fileName,
        category: 'background'
    }
})

export const assets: ImageAsset[] = [
    ...bgAssets,
    {
        id: 'bucket.png',
        href: './assets/things/bucket.png',
        category: 'item'
    }
]