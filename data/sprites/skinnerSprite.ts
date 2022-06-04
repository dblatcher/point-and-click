import { SpriteData, SpriteSheet } from '../../src/definitions/SpriteSheet'

export const sheets: SpriteSheet[] = [
    {
        id: 'skinner-1-l',
        url: "./assets/characters/skinner-1-l.png",
        rows: 1,
        cols: 12
    },
    {
        id: 'skinner-1-r',
        url: "./assets/characters/skinner-1-r.png",
        rows: 1,
        cols: 12
    },
    {
        id: 'skinner-2-l',
        url: "./assets/characters/skinner-2-l.png",
        rows: 1,
        cols: 5,
        widthScale: 1.75
    },
    {
        id: 'skinner-2-r',
        url: "./assets/characters/skinner-2-r.png",
        rows: 1,
        cols: 5,
        widthScale: 1.75
    },
]

export const data: SpriteData = {
    id: 'skinner',
    defaultDirection: 'right',
    animations: {
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
                { sheetId: 'skinner-1-l', row: 0, col: 7 },
                { sheetId: 'skinner-1-l', row: 0, col: 6 },
            ],
            right: [
                { sheetId: 'skinner-1-r', row: 0, col: 6 },
                { sheetId: 'skinner-1-r', row: 0, col: 5 },
                { sheetId: 'skinner-1-r', row: 0, col: 4 },
                { sheetId: 'skinner-1-r', row: 0, col: 3 },
                { sheetId: 'skinner-1-r', row: 0, col: 4 },
                { sheetId: 'skinner-1-r', row: 0, col: 5 },
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
        yell: {
            left: [
                { sheetId: 'skinner-1-l', row: 0, col: 0 },
                { sheetId: 'skinner-1-l', row: 0, col: 1 },
                { sheetId: 'skinner-1-l', row: 0, col: 3 },
                { sheetId: 'skinner-1-l', row: 0, col: 1 },
            ],
            right: [
                { sheetId: 'skinner-1-r', row: 0, col: 11 },
                { sheetId: 'skinner-1-r', row: 0, col: 10 },
                { sheetId: 'skinner-1-r', row: 0, col: 8 },
                { sheetId: 'skinner-1-r', row: 0, col: 10 },
            ]
        },
        think: {
            left: [
                { sheetId: 'skinner-1-l', row: 0, col: 2 },
                { sheetId: 'skinner-1-l', row: 0, col: 2 },
                { sheetId: 'skinner-1-l', row: 0, col: 2 },
                { sheetId: 'skinner-1-l', row: 0, col: 3 },
            ],
            right: [
                { sheetId: 'skinner-1-r', row: 0, col: 9 },
                { sheetId: 'skinner-1-r', row: 0, col: 9 },
                { sheetId: 'skinner-1-r', row: 0, col: 9 },
                { sheetId: 'skinner-1-r', row: 0, col: 8 },
            ]
        },
        run: {
            left: [
                { sheetId: 'skinner-2-l', row: 0, col: 0 },
                { sheetId: 'skinner-2-l', row: 0, col: 1 },
                { sheetId: 'skinner-2-l', row: 0, col: 2 },
                { sheetId: 'skinner-2-l', row: 0, col: 3 },
                { sheetId: 'skinner-2-l', row: 0, col: 4 },
                { sheetId: 'skinner-2-l', row: 0, col: 3 },
                { sheetId: 'skinner-2-l', row: 0, col: 2 },
                { sheetId: 'skinner-2-l', row: 0, col: 1 },
            ],
            right: [
                { sheetId: 'skinner-2-r', row: 0, col: 0 },
                { sheetId: 'skinner-2-r', row: 0, col: 1 },
                { sheetId: 'skinner-2-r', row: 0, col: 2 },
                { sheetId: 'skinner-2-r', row: 0, col: 3 },
                { sheetId: 'skinner-2-r', row: 0, col: 4 },
                { sheetId: 'skinner-2-r', row: 0, col: 3 },
                { sheetId: 'skinner-2-r', row: 0, col: 2 },
                { sheetId: 'skinner-2-r', row: 0, col: 1 },
            ],
        }
    }
}
