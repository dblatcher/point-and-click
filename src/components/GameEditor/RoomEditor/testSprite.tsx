import { ActorData, SpriteData } from "@/definitions"
import { Point } from "@/lib/pathfinding/geometry";
import { Sprite } from "@/lib/Sprite";
import imageService from "@/services/imageService";


const data: SpriteData = {
    id: '_test_sprite',
    defaultDirection: 'right',
    animations: {
        default: {
            left: [
                { imageId: '_TEST_SPRITE_IMG', row: 1, col: 0 },
                { imageId: '_TEST_SPRITE_IMG', row: 1, col: 1 },
                { imageId: '_TEST_SPRITE_IMG', row: 1, col: 2 },
                { imageId: '_TEST_SPRITE_IMG', row: 1, col: 1 },
            ],
            right: [
                { imageId: '_TEST_SPRITE_IMG', row: 0, col: 0 },
                { imageId: '_TEST_SPRITE_IMG', row: 0, col: 1 },
                { imageId: '_TEST_SPRITE_IMG', row: 0, col: 2 },
                { imageId: '_TEST_SPRITE_IMG', row: 0, col: 1 },
            ]
        },
    }
}

export const testSprite = new Sprite(data)


export const makeTestActor = (point: Point): ActorData => {

    imageService.add({
        id: '_TEST_SPRITE_IMG',
        category: 'spriteSheet',
        href: './assets/characters/mario.png',
        rows: 2,
        cols: 3,
    })

    return {
        id: 'TEST',
        name: 'Test Sprite',
        status: 'default',
        type: 'actor',
        room: 'NA',
        x: point.x,
        y: point.y,
        width: 40,
        height: 100,
        sprite: testSprite.data.id,
        direction: 'right',
        dialogueColor: '#ff0000',
    }
}
