import { SpriteData, SpriteSheet } from "../../src/definitions/SpriteSheet";

export const sheets: SpriteSheet[] = [
    {
        id: 'mario',
        imageId: "mario.png",
        rows: 2,
        cols: 3
    },
]

export const data: SpriteData = {
    id: 'mario',
    defaultDirection: 'right',
    animations: {
        default: {
            left: [
                { imageId: 'mario', row: 1, col: 0 },
            ],
            right: [
                { imageId: 'mario', row: 0, col: 0 },
            ]
        },
        walk: {
            left: [
                { imageId: 'mario', row: 1, col: 0 },
                { imageId: 'mario', row: 1, col: 1 },
                { imageId: 'mario', row: 1, col: 2 },
                { imageId: 'mario', row: 1, col: 1 },
            ],
            right: [
                { imageId: 'mario', row: 0, col: 0 },
                { imageId: 'mario', row: 0, col: 1 },
                { imageId: 'mario', row: 0, col: 2 },
                { imageId: 'mario', row: 0, col: 1 },
            ]
        },
    }
}
