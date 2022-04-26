import { SpriteData, SpriteSheet } from "../src/definitions/SpriteSheet";

export const sheets:SpriteSheet[] = [
    {
        id: 'mario',
        "url": "./assets/characters/mario.png",
        rows: 2,
        cols: 3
    },
]

export const data: SpriteData = {
    id: 'mario',
    defaultDirection: 'right',
    sequences: {
        default: {
            left: [
                { sheetId: 'mario', row: 1, col: 0 },
            ],
            right: [
                { sheetId: 'mario', row: 0, col: 0 },
            ]
        },
        walk: {
            left: [
                { sheetId: 'mario', row: 1, col: 0 },
                { sheetId: 'mario', row: 1, col: 1 },
                { sheetId: 'mario', row: 1, col: 2 },
                { sheetId: 'mario', row: 1, col: 1 },
            ],
            right: [
                { sheetId: 'mario', row: 0, col: 0 },
                { sheetId: 'mario', row: 0, col: 1 },
                { sheetId: 'mario', row: 0, col: 2 },
                { sheetId: 'mario', row: 0, col: 1 },
            ]
        },
    }
}
