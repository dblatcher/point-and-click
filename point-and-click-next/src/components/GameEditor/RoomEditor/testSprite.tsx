import { ActorData, SpriteData  } from "@/oldsrc"
import { Point } from "@/lib/pathfinding/geometry";
import { Sprite } from "@/lib/Sprite";
import spriteService from "@/services/spriteService";
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

const testSprite = new Sprite(data)


const makeTestActor: { (point: Point): ActorData } = (point) => {

    spriteService.add(testSprite)
    imageService.add({
        id:'_TEST_SPRITE_IMG',
        category:'spriteSheet',
        href:'./assets/characters/mario.png',
        rows:2,
        cols:3,
    })

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