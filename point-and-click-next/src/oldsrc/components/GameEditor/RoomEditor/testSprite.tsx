import { ActorData, SpriteData  } from "src"
import { Point } from "../../../../lib/pathfinding/geometry";
import { Sprite } from "../../../../lib/Sprite";
import spriteService from "../../../services/spriteService";


const data: SpriteData = {
    id: '_test_sprite',
    defaultDirection: 'right',
    animations: {
        default: {
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

const testSprite = new Sprite(data)


const makeTestActor: { (point: Point): ActorData } = (point) => {

    spriteService.add(testSprite)

    return {
        id: 'TEST',
        name: 'Test Sprite',
        status: 'default',
        type: 'actor',
        room: 'NA',
        x: point.x,
        y: point.y,
        width: 20,
        height: 50,
        sprite: testSprite.data.id,
        direction: 'right',
        dialogueColor: 'red',
    }
}

export { makeTestActor }