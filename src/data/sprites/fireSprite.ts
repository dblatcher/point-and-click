import { SpriteData } from "@/definitions/SpriteSheet";

export const fireSprite: SpriteData = {
    id: 'fire',
    defaultDirection: 'left',
    animations: {
        default: {
            left: [
                { imageId: 'Fire.png', row: 0, col: 0 },
                { imageId: 'Fire.png', row: 0, col: 1 },
                { imageId: 'Fire.png', row: 0, col: 2 },
                { imageId: 'Fire.png', row: 0, col: 3 },
            ],
        },
        out: {
            left: [
                { imageId: 'Fire.png', row: 1, col: 2 },
                { imageId: 'Fire.png', row: 1, col: 3 },
            ],
        },
        fade: {
            left: [
                { imageId: 'Fire.png', row: 0, col: 1 },
                { imageId: 'Fire.png', row: 0, col: 0 },
                { imageId: 'Fire.png', row: 1, col: 0 },
                { imageId: 'Fire.png', row: 1, col: 1 },
                { imageId: 'Fire.png', row: 1, col: 2 },
            ]
        }
    }
}
