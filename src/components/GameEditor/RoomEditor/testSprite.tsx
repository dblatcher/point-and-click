import { ActorData, SpriteData, SpriteSheet  } from "src"
import { Point } from "../../../lib/pathfinding/geometry";
import { Sprite } from "../../../lib/Sprite";
import spriteService from "../../../services/spriteService";
import spriteSheetService from "../../../services/spriteSheetService";


const testSpriteSheets: SpriteSheet[] = [
    {
        id: '_test_sprite_sheet',
        imageId: "mario.png",
        rows: 2,
        cols: 3
    },
]

const data: SpriteData = {
    id: '_test_sprite',
    defaultDirection: 'right',
    animations: {
        default: {
            left: [
                { imageId: '_test_sprite_sheet', row: 1, col: 0 },
                { imageId: '_test_sprite_sheet', row: 1, col: 1 },
                { imageId: '_test_sprite_sheet', row: 1, col: 2 },
                { imageId: '_test_sprite_sheet', row: 1, col: 1 },
            ],
            right: [
                { imageId: '_test_sprite_sheet', row: 0, col: 0 },
                { imageId: '_test_sprite_sheet', row: 0, col: 1 },
                { imageId: '_test_sprite_sheet', row: 0, col: 2 },
                { imageId: '_test_sprite_sheet', row: 0, col: 1 },
            ]
        },
    }
}

const testSprite = new Sprite(data)


const makeTestActor: { (point: Point): ActorData } = (point) => {

    spriteService.add(testSprite)
    spriteSheetService.add(testSpriteSheets)

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