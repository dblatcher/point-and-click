import { ImageAsset, ImageAssetCategory } from "@/services/assets"

const backgroundPath = "./assets/backgrounds/"
const actorSpritePath = "./assets/characters/"
const thingSpritePath = "./assets/things/"

const buildAsset = (fileName: string, path: string, category: ImageAssetCategory, props: Partial<ImageAsset> = {}): ImageAsset => {
    return {
        id: fileName,
        href: path + fileName,
        category,
        originalFileName: fileName,
        ...props
    }
}

const imageAssets: ImageAsset[] = [
    buildAsset('mario.png', actorSpritePath, 'spriteSheet', { cols: 3, rows: 2 }),
    buildAsset("skinner-1-l.png", actorSpritePath, 'spriteSheet', { cols: 12, rows: 1 }),
    buildAsset("skinner-1-r.png", actorSpritePath, 'spriteSheet', { cols: 12, rows: 1 }),
    buildAsset("skinner-2-l.png", actorSpritePath, 'spriteSheet', { cols: 5, rows: 1, widthScale: 1.75 }),
    buildAsset("skinner-2-r.png", actorSpritePath, 'spriteSheet', { cols: 5, rows: 1, widthScale: 1.75 }),
    buildAsset("boy.png", actorSpritePath, 'spriteSheet', { cols: 4, rows: 4, category: 'any' }),
    buildAsset("Fire.png", thingSpritePath, 'spriteSheet', { cols: 4, rows: 2 }),
    buildAsset("bucket.png", thingSpritePath, 'spriteSheet'),
    buildAsset("tube.png", thingSpritePath, 'spriteSheet'),
    buildAsset("square-room.png", backgroundPath, 'background'),
    buildAsset("hill.png", backgroundPath, 'background'),
    buildAsset("indoors.png", backgroundPath, 'background'),
    buildAsset("sky.png", backgroundPath, 'background'),
    buildAsset("trees.png", backgroundPath, 'background'),
]

export { imageAssets }
