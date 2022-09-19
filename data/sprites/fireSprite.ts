import { SpriteData, SpriteSheet } from "../../src/definitions/SpriteSheet";

export const sheets: SpriteSheet[] = [
    {
        id: 'fire',
        imageId: "Fire.png",
        rows: 2,
        cols: 4
    },
]

export const data: SpriteData = {
    id: 'fire',
    defaultDirection: 'left',
    animations: {
        default: {
            left: [
                { imageId: 'fire', row: 0, col: 0 },
                { imageId: 'fire', row: 0, col: 1 },
                { imageId: 'fire', row: 0, col: 2 },
                { imageId: 'fire', row: 0, col: 3 },
            ],
        },
        out: {
            left: [
                { imageId: 'fire', row: 1, col: 2 },
                { imageId: 'fire', row: 1, col: 3 },
            ],
        },
        fade: {
            left: [
                { imageId: 'fire', row: 0, col: 1 },
                { imageId: 'fire', row: 0, col: 0 },
                { imageId: 'fire', row: 1, col: 0 },
                { imageId: 'fire', row: 1, col: 1 },
                { imageId: 'fire', row: 1, col: 2 },
            ]
        }
    }
}
