import { SpriteData, SpriteSheet } from '../../src/definitions/SpriteSheet'

export const sheets: SpriteSheet[] = [
    {
        id: 'skinner-1-l',
        imageId: "skinner-1-l.png",
        rows: 1,
        cols: 12
    },
    {
        id: 'skinner-1-r',
        imageId: "skinner-1-r.png",
        rows: 1,
        cols: 12
    },
    {
        id: 'skinner-2-l',
        imageId: "skinner-2-l.png",
        rows: 1,
        cols: 5,
        widthScale: 1.75
    },
    {
        id: 'skinner-2-r',
        imageId: "skinner-2-r.png",
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
                { imageId: 'skinner-1-l', row: 0, col: 10 },
                { imageId: 'skinner-1-l', row: 0, col: 11 },
                { imageId: 'skinner-1-l', row: 0, col: 11 },
                { imageId: 'skinner-1-l', row: 0, col: 11 },
                { imageId: 'skinner-1-l', row: 0, col: 4 },
            ],
            right: [
                { imageId: 'skinner-1-r', row: 0, col: 1 },
                { imageId: 'skinner-1-r', row: 0, col: 0 },
                { imageId: 'skinner-1-r', row: 0, col: 0 },
                { imageId: 'skinner-1-r', row: 0, col: 0 },
                { imageId: 'skinner-1-r', row: 0, col: 7 },
            ]
        },
        walk: {
            left: [
                { imageId: 'skinner-1-l', row: 0, col: 5 },
                { imageId: 'skinner-1-l', row: 0, col: 6 },
                { imageId: 'skinner-1-l', row: 0, col: 7 },
                { imageId: 'skinner-1-l', row: 0, col: 8 },
                { imageId: 'skinner-1-l', row: 0, col: 7 },
                { imageId: 'skinner-1-l', row: 0, col: 6 },
            ],
            right: [
                { imageId: 'skinner-1-r', row: 0, col: 6 },
                { imageId: 'skinner-1-r', row: 0, col: 5 },
                { imageId: 'skinner-1-r', row: 0, col: 4 },
                { imageId: 'skinner-1-r', row: 0, col: 3 },
                { imageId: 'skinner-1-r', row: 0, col: 4 },
                { imageId: 'skinner-1-r', row: 0, col: 5 },
            ],
        },
        talk: {
            left: [
                { imageId: 'skinner-1-l', row: 0, col: 11 },
                { imageId: 'skinner-1-l', row: 0, col: 9 },
                { imageId: 'skinner-1-l', row: 0, col: 11 },
            ],
            right: [
                { imageId: 'skinner-1-r', row: 0, col: 0 },
                { imageId: 'skinner-1-r', row: 0, col: 2 },
                { imageId: 'skinner-1-r', row: 0, col: 0 },
            ],
        },
        yell: {
            left: [
                { imageId: 'skinner-1-l', row: 0, col: 0 },
                { imageId: 'skinner-1-l', row: 0, col: 1 },
                { imageId: 'skinner-1-l', row: 0, col: 3 },
                { imageId: 'skinner-1-l', row: 0, col: 1 },
            ],
            right: [
                { imageId: 'skinner-1-r', row: 0, col: 11 },
                { imageId: 'skinner-1-r', row: 0, col: 10 },
                { imageId: 'skinner-1-r', row: 0, col: 8 },
                { imageId: 'skinner-1-r', row: 0, col: 10 },
            ]
        },
        think: {
            left: [
                { imageId: 'skinner-1-l', row: 0, col: 2 },
                { imageId: 'skinner-1-l', row: 0, col: 2 },
                { imageId: 'skinner-1-l', row: 0, col: 2 },
                { imageId: 'skinner-1-l', row: 0, col: 3 },
            ],
            right: [
                { imageId: 'skinner-1-r', row: 0, col: 9 },
                { imageId: 'skinner-1-r', row: 0, col: 9 },
                { imageId: 'skinner-1-r', row: 0, col: 9 },
                { imageId: 'skinner-1-r', row: 0, col: 8 },
            ]
        },
        run: {
            left: [
                { imageId: 'skinner-2-l', row: 0, col: 0 },
                { imageId: 'skinner-2-l', row: 0, col: 1 },
                { imageId: 'skinner-2-l', row: 0, col: 2 },
                { imageId: 'skinner-2-l', row: 0, col: 3 },
                { imageId: 'skinner-2-l', row: 0, col: 4 },
                { imageId: 'skinner-2-l', row: 0, col: 3 },
                { imageId: 'skinner-2-l', row: 0, col: 2 },
                { imageId: 'skinner-2-l', row: 0, col: 1 },
            ],
            right: [
                { imageId: 'skinner-2-r', row: 0, col: 0 },
                { imageId: 'skinner-2-r', row: 0, col: 1 },
                { imageId: 'skinner-2-r', row: 0, col: 2 },
                { imageId: 'skinner-2-r', row: 0, col: 3 },
                { imageId: 'skinner-2-r', row: 0, col: 4 },
                { imageId: 'skinner-2-r', row: 0, col: 3 },
                { imageId: 'skinner-2-r', row: 0, col: 2 },
                { imageId: 'skinner-2-r', row: 0, col: 1 },
            ],
        }
    }
}
