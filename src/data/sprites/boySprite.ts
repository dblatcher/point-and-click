import { SpriteData } from "point-click-lib";

export const boySprite: SpriteData = {
    id: 'boy',
    defaultDirection: 'down',
    animations: {
        default: {
            down: [
                { imageId: 'boy.png', row: 0, col: 0 },
            ],
            up: [
                { imageId: 'boy.png', row: 1, col: 0 },
            ],
            left: [
                { imageId: 'boy.png', row: 2, col: 0 },
            ],
            right: [
                { imageId: 'boy.png', row: 3, col: 0 },
            ],
        },
        walk: {
            down: [
                { imageId: 'boy.png', row: 0, col: 0 },
                { imageId: 'boy.png', row: 0, col: 1 },
                { imageId: 'boy.png', row: 0, col: 2 },
                { imageId: 'boy.png', row: 0, col: 3 },
            ],
            up: [
                { imageId: 'boy.png', row: 1, col: 0 },
                { imageId: 'boy.png', row: 1, col: 1 },
                { imageId: 'boy.png', row: 1, col: 2 },
                { imageId: 'boy.png', row: 1, col: 3 },
            ],
            left: [
                { imageId: 'boy.png', row: 2, col: 0 },
                { imageId: 'boy.png', row: 2, col: 1 },
                { imageId: 'boy.png', row: 2, col: 2 },
                { imageId: 'boy.png', row: 2, col: 3 },
            ],
            right: [
                { imageId: 'boy.png', row: 3, col: 0 },
                { imageId: 'boy.png', row: 3, col: 1 },
                { imageId: 'boy.png', row: 3, col: 2 },
                { imageId: 'boy.png', row: 3, col: 3 },
            ],

        },
    }
}
