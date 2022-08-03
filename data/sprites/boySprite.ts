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
                { sheetId: 'boy', row: 0, col: 0 },
            ],
            up: [
                { sheetId: 'boy', row: 1, col: 0 },
            ],
            left: [
                { sheetId: 'boy', row: 2, col: 0 },
            ],
            right: [
                { sheetId: 'boy', row: 3, col: 0 },
            ],
        },
        walk: {
            down: [
                { sheetId: 'boy', row: 0, col: 0 },
                { sheetId: 'boy', row: 0, col: 1 },
                { sheetId: 'boy', row: 0, col: 2 },
                { sheetId: 'boy', row: 0, col: 3 },
            ],
            up: [
                { sheetId: 'boy', row: 1, col: 0 },
                { sheetId: 'boy', row: 1, col: 1 },
                { sheetId: 'boy', row: 1, col: 2 },
                { sheetId: 'boy', row: 1, col: 3 },
            ],
            left: [
                { sheetId: 'boy', row: 2, col: 0 },
                { sheetId: 'boy', row: 2, col: 1 },
                { sheetId: 'boy', row: 2, col: 2 },
                { sheetId: 'boy', row: 2, col: 3 },
            ],
            right: [
                { sheetId: 'boy', row: 3, col: 0 },
                { sheetId: 'boy', row: 3, col: 1 },
                { sheetId: 'boy', row: 3, col: 2 },
                { sheetId: 'boy', row: 3, col: 3 },
            ],

        },
    }
}
