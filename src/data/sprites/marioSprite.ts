import { SpriteData } from "point-click-lib";

export const marioSprite: SpriteData = {
    id: 'mario',
    defaultDirection: 'right',
    animations: {
        default: {
            left: [
                { imageId: 'mario.png', row: 1, col: 0 },
            ],
            right: [
                { imageId: 'mario.png', row: 0, col: 0 },
            ]
        },
        walk: {
            left: [
                { imageId: 'mario.png', row: 1, col: 0 },
                { imageId: 'mario.png', row: 1, col: 1 },
                { imageId: 'mario.png', row: 1, col: 2 },
                { imageId: 'mario.png', row: 1, col: 1 },
            ],
            right: [
                { imageId: 'mario.png', row: 0, col: 0 },
                { imageId: 'mario.png', row: 0, col: 1 },
                { imageId: 'mario.png', row: 0, col: 2 },
                { imageId: 'mario.png', row: 0, col: 1 },
            ]
        },
    }
}
