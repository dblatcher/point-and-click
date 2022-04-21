import { SpriteData, SpriteSheet } from "../src/lib/Sprite";

export const sheets:SpriteSheet[] = [
    {
        id: 'skinner-1-l',
        "url": "./assets/characters/skinner-1-l.png",
        rows: 1,
        cols: 12
    },
    {
        id: 'skinner-1-r',
        "url": "./assets/characters/skinner-1-r.png",
        rows: 1,
        cols: 12
    },
]

export const data: SpriteData = {
    id: 'skinner',
    defaultDirection: 'right',
    sequences: {
        default: {
            left: [
                { sheetId: 'skinner-1-l', row: 0, col: 10 },
                { sheetId: 'skinner-1-l', row: 0, col: 11 },
                { sheetId: 'skinner-1-l', row: 0, col: 11 },
                { sheetId: 'skinner-1-l', row: 0, col: 11 },
                { sheetId: 'skinner-1-l', row: 0, col: 4 },
            ],
            right: [
                { sheetId: 'skinner-1-r', row: 0, col: 1 },
                { sheetId: 'skinner-1-r', row: 0, col: 0 },
                { sheetId: 'skinner-1-r', row: 0, col: 0 },
                { sheetId: 'skinner-1-r', row: 0, col: 0 },
                { sheetId: 'skinner-1-r', row: 0, col: 7 },
            ]
        },
        walk: {
            left: [
                { sheetId: 'skinner-1-l', row: 0, col: 5 },
                { sheetId: 'skinner-1-l', row: 0, col: 6 },
                { sheetId: 'skinner-1-l', row: 0, col: 7 },
                { sheetId: 'skinner-1-l', row: 0, col: 8 },
            ],
            right: [
                { sheetId: 'skinner-1-r', row: 0, col: 6 },
                { sheetId: 'skinner-1-r', row: 0, col: 5 },
                { sheetId: 'skinner-1-r', row: 0, col: 4 },
                { sheetId: 'skinner-1-r', row: 0, col: 3 },
            ],
        },
        talk: {
            left: [
                { sheetId: 'skinner-1-l', row: 0, col: 11 },
                { sheetId: 'skinner-1-l', row: 0, col: 9 },
                { sheetId: 'skinner-1-l', row: 0, col: 11 },
            ],
            right: [
                { sheetId: 'skinner-1-r', row: 0, col: 0 },
                { sheetId: 'skinner-1-r', row: 0, col: 2 },
                { sheetId: 'skinner-1-r', row: 0, col: 0 },
            ],
        },
    }
}
