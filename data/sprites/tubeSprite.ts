import { SpriteData } from "../../src/definitions/SpriteSheet";

export const data: SpriteData = {
    id: 'tube',
    defaultDirection: 'left',
    animations: {
        default: {
            left: [
                { imageId: 'tube.png', row: 0, col: 0 },
            ],
        }
    }
}
