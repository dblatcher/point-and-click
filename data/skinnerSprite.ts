import { Sprite, SpriteData, SpriteSheet } from "../src/lib/Sprite";

export const sheetLeft: SpriteSheet = {
    id: 'skinner-1-l',
    "url": "./assets/characters/skinner-1-l.png",
    rows: 1,
    cols: 12
}

export const skinner: SpriteData = {
    id: 'skinner',
    sequences: {
        wait: [
            { sheetId: 'skinner-1-l', row: 0, col: 10 },
            { sheetId: 'skinner-1-l', row: 0, col: 4 }
        ],
        walk: [
            { sheetId: 'skinner-1-l', row: 0, col: 5 },
            { sheetId: 'skinner-1-l', row: 0, col: 6 },
            { sheetId: 'skinner-1-l', row: 0, col: 7 },
            { sheetId: 'skinner-1-l', row: 0, col: 8 }
        ]
    }
}
