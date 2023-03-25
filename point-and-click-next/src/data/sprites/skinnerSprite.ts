import { SpriteData } from '@/oldsrc/definitions/SpriteSheet'

export const data: SpriteData = {
    id: 'skinner',
    defaultDirection: 'right',
    animations: {
        default: {
            left: [
                { imageId: 'skinner-1-l.png', row: 0, col: 10 },
                { imageId: 'skinner-1-l.png', row: 0, col: 11 },
                { imageId: 'skinner-1-l.png', row: 0, col: 11 },
                { imageId: 'skinner-1-l.png', row: 0, col: 11 },
                { imageId: 'skinner-1-l.png', row: 0, col: 4 },
            ],
            right: [
                { imageId: 'skinner-1-r.png', row: 0, col: 1 },
                { imageId: 'skinner-1-r.png', row: 0, col: 0 },
                { imageId: 'skinner-1-r.png', row: 0, col: 0 },
                { imageId: 'skinner-1-r.png', row: 0, col: 0 },
                { imageId: 'skinner-1-r.png', row: 0, col: 7 },
            ]
        },
        walk: {
            left: [
                { imageId: 'skinner-1-l.png', row: 0, col: 5 },
                { imageId: 'skinner-1-l.png', row: 0, col: 6 },
                { imageId: 'skinner-1-l.png', row: 0, col: 7 },
                { imageId: 'skinner-1-l.png', row: 0, col: 8 },
                { imageId: 'skinner-1-l.png', row: 0, col: 7 },
                { imageId: 'skinner-1-l.png', row: 0, col: 6 },
            ],
            right: [
                { imageId: 'skinner-1-r.png', row: 0, col: 6 },
                { imageId: 'skinner-1-r.png', row: 0, col: 5 },
                { imageId: 'skinner-1-r.png', row: 0, col: 4 },
                { imageId: 'skinner-1-r.png', row: 0, col: 3 },
                { imageId: 'skinner-1-r.png', row: 0, col: 4 },
                { imageId: 'skinner-1-r.png', row: 0, col: 5 },
            ],
        },
        talk: {
            left: [
                { imageId: 'skinner-1-l.png', row: 0, col: 11 },
                { imageId: 'skinner-1-l.png', row: 0, col: 9 },
                { imageId: 'skinner-1-l.png', row: 0, col: 11 },
            ],
            right: [
                { imageId: 'skinner-1-r.png', row: 0, col: 0 },
                { imageId: 'skinner-1-r.png', row: 0, col: 2 },
                { imageId: 'skinner-1-r.png', row: 0, col: 0 },
            ],
        },
        yell: {
            left: [
                { imageId: 'skinner-1-l.png', row: 0, col: 0 },
                { imageId: 'skinner-1-l.png', row: 0, col: 1 },
                { imageId: 'skinner-1-l.png', row: 0, col: 3 },
                { imageId: 'skinner-1-l.png', row: 0, col: 1 },
            ],
            right: [
                { imageId: 'skinner-1-r.png', row: 0, col: 11 },
                { imageId: 'skinner-1-r.png', row: 0, col: 10 },
                { imageId: 'skinner-1-r.png', row: 0, col: 8 },
                { imageId: 'skinner-1-r.png', row: 0, col: 10 },
            ]
        },
        think: {
            left: [
                { imageId: 'skinner-1-l.png', row: 0, col: 2 },
                { imageId: 'skinner-1-l.png', row: 0, col: 2 },
                { imageId: 'skinner-1-l.png', row: 0, col: 2 },
                { imageId: 'skinner-1-l.png', row: 0, col: 3 },
            ],
            right: [
                { imageId: 'skinner-1-r.png', row: 0, col: 9 },
                { imageId: 'skinner-1-r.png', row: 0, col: 9 },
                { imageId: 'skinner-1-r.png', row: 0, col: 9 },
                { imageId: 'skinner-1-r.png', row: 0, col: 8 },
            ]
        },
        run: {
            left: [
                { imageId: 'skinner-2-l.png', row: 0, col: 0 },
                { imageId: 'skinner-2-l.png', row: 0, col: 1 },
                { imageId: 'skinner-2-l.png', row: 0, col: 2 },
                { imageId: 'skinner-2-l.png', row: 0, col: 3 },
                { imageId: 'skinner-2-l.png', row: 0, col: 4 },
                { imageId: 'skinner-2-l.png', row: 0, col: 3 },
                { imageId: 'skinner-2-l.png', row: 0, col: 2 },
                { imageId: 'skinner-2-l.png', row: 0, col: 1 },
            ],
            right: [
                { imageId: 'skinner-2-r.png', row: 0, col: 0 },
                { imageId: 'skinner-2-r.png', row: 0, col: 1 },
                { imageId: 'skinner-2-r.png', row: 0, col: 2 },
                { imageId: 'skinner-2-r.png', row: 0, col: 3 },
                { imageId: 'skinner-2-r.png', row: 0, col: 4 },
                { imageId: 'skinner-2-r.png', row: 0, col: 3 },
                { imageId: 'skinner-2-r.png', row: 0, col: 2 },
                { imageId: 'skinner-2-r.png', row: 0, col: 1 },
            ],
        }
    }
}
