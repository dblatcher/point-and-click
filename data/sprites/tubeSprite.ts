import { SpriteData, SpriteSheet } from "../../src/definitions/SpriteSheet";

export const sheets: SpriteSheet[] = [
    {
        id: 'tube',
        url: "./assets/things/tube.png",
        rows: 1,
        cols: 1
    },
]

export const data: SpriteData = {
    id: 'tube',
    defaultDirection: 'left',
    animations: {
        default: {
            left: [
                { sheetId: 'tube', row: 0, col: 0 },
            ],
        }
    }
}
