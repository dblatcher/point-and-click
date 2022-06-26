import { SpriteData, SpriteSheet } from "../../../definitions/SpriteSheet";
import { CharacterData } from "../../../definitions/CharacterData"
import { Point } from "../../../lib/pathfinding/geometry";
import { Sprite } from "../../../lib/Sprite";
import spriteService from "../../../services/spriteService";
import spriteSheetService from "../../../services/spriteSheetService";


const testSpriteSheets: SpriteSheet[] = [
    {
        id: '_test_sprite_sheet',
        url: "./assets/characters/mario.png",
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
                { sheetId: '_test_sprite_sheet', row: 1, col: 0 },
                { sheetId: '_test_sprite_sheet', row: 1, col: 1 },
                { sheetId: '_test_sprite_sheet', row: 1, col: 2 },
                { sheetId: '_test_sprite_sheet', row: 1, col: 1 },
            ],
            right: [
                { sheetId: '_test_sprite_sheet', row: 0, col: 0 },
                { sheetId: '_test_sprite_sheet', row: 0, col: 1 },
                { sheetId: '_test_sprite_sheet', row: 0, col: 2 },
                { sheetId: '_test_sprite_sheet', row: 0, col: 1 },
            ]
        },
    }
}

const testSprite = new Sprite(data)


const makeTestCharacter: { (point: Point): CharacterData } = (point) => {

    spriteService.add(testSprite)
    spriteSheetService.add(testSpriteSheets)

    return {
        id: 'TEST',
        name: 'Test Sprite',
        status: 'default',
        type: 'character',
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

export { makeTestCharacter }