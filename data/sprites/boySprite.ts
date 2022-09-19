import { SpriteData, SpriteSheet } from "../../src/definitions/SpriteSheet";

export const sheets: SpriteSheet[] = [
    {
        id: 'boy',
        imageId: "boy.png",
        rows: 4,
        cols: 4
    },
]

export const data: SpriteData = {
    id: 'boy',
    defaultDirection: 'down',
    animations: {
        default: {
            down: [
                { imageId: 'boy', row: 0, col: 0 },
            ],
            up: [
                { imageId: 'boy', row: 1, col: 0 },
            ],
            left: [
                { imageId: 'boy', row: 2, col: 0 },
            ],
            right: [
                { imageId: 'boy', row: 3, col: 0 },
            ],
        },
        walk: {
            down: [
                { imageId: 'boy', row: 0, col: 0 },
                { imageId: 'boy', row: 0, col: 1 },
                { imageId: 'boy', row: 0, col: 2 },
                { imageId: 'boy', row: 0, col: 3 },
            ],
            up: [
                { imageId: 'boy', row: 1, col: 0 },
                { imageId: 'boy', row: 1, col: 1 },
                { imageId: 'boy', row: 1, col: 2 },
                { imageId: 'boy', row: 1, col: 3 },
            ],
            left: [
                { imageId: 'boy', row: 2, col: 0 },
                { imageId: 'boy', row: 2, col: 1 },
                { imageId: 'boy', row: 2, col: 2 },
                { imageId: 'boy', row: 2, col: 3 },
            ],
            right: [
                { imageId: 'boy', row: 3, col: 0 },
                { imageId: 'boy', row: 3, col: 1 },
                { imageId: 'boy', row: 3, col: 2 },
                { imageId: 'boy', row: 3, col: 3 },
            ],

        },
    }
}
