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

const charactersPath = "./assets/characters/"
const charactersFileNames = [
    "mario.png",
    "skinner-1-l.png",
    "skinner-1-r.png",
    "skinner-2-l.png",
    "skinner-2-r.png",
]
const chAssets: ImageAsset[] = charactersFileNames.map(fileName => {
    return {
        id: fileName,
        href: charactersPath + fileName,
        category: 'spritesheet'
    }
})

const thingsPath = "./assets/things/"
const thingsFileNames = [
    "bucket.png",
    "Fire.png",
    "tube.png",
]
const thAssets: ImageAsset[] = thingsFileNames.map(fileName => {
    return {
        id: fileName,
        href: thingsPath + fileName,
        category: 'spritesheet'
    }
})

export const assets:ImageAsset[] = [
    ...chAssets,
    ...bgAssets,
    ...thAssets,
]