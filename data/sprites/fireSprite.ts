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
                { sheetId: 'fire', row: 0, col: 0 },
                { sheetId: 'fire', row: 0, col: 1 },
                { sheetId: 'fire', row: 0, col: 2 },
                { sheetId: 'fire', row: 0, col: 3 },
            ],
        },
        out: {
            left: [
                { sheetId: 'fire', row: 1, col: 2 },
                { sheetId: 'fire', row: 1, col: 3 },
            ],
        },
        fade: {
            left: [
                { sheetId: 'fire', row: 0, col: 1 },
                { sheetId: 'fire', row: 0, col: 0 },
                { sheetId: 'fire', row: 1, col: 0 },
                { sheetId: 'fire', row: 1, col: 1 },
                { sheetId: 'fire', row: 1, col: 2 },
            ]
        }
    }
}
