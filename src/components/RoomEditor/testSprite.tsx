import { SpriteData, SpriteSheet } from "../../definitions/SpriteSheet";
import { CharacterData } from "../../definitions/CharacterData"
import { Point } from "../../lib/pathfinding/geometry";
import { Sprite } from "../../lib/Sprite";


const sheets: SpriteSheet[] = [
    {
        id: 'mario',
        url: "./assets/characters/mario.png",
        rows: 2,
        cols: 3
    },
]

const data: SpriteData = {
    id: 'mario',
    defaultDirection: 'right',
    animations: {
        default: {
            left: [
                { sheetId: 'mario', row: 1, col: 0 },
                { sheetId: 'mario', row: 1, col: 1 },
                { sheetId: 'mario', row: 1, col: 2 },
                { sheetId: 'mario', row: 1, col: 1 },
            ],
            right: [
                { sheetId: 'mario', row: 0, col: 0 },
                { sheetId: 'mario', row: 0, col: 1 },
                { sheetId: 'mario', row: 0, col: 2 },
                { sheetId: 'mario', row: 0, col: 1 },
            ]
        },
    }
}

const testSprite = new Sprite(data, sheets)


const makeTestCharacter: { (point: Point): CharacterData } = (point) => {
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

export { testSprite, makeTestCharacter }