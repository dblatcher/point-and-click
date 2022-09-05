import { ActorData } from "../src/definitions/ActorData"

export const initialActors: ActorData[] = [
    {
        id: 'PLAYER',
        name: 'Seymour Skinner',
        type: 'actor',
        isPlayer: true,
        room: 'OUTSIDE',
        x: (200),
        y: 10,
        width: 40,
        height: 80,
        sprite: 'skinner',
        direction: 'left',
        dialogueColor: 'red',
    },
    {
        id: 'EVIL_SKINNER',
        name: 'Evil Skinner',
        type: 'actor',
        room: 'INSIDE',
        x: (640 * 2 / 5),
        y: 10,
        width: 40,
        height: 80,
        sprite: 'skinner',
        status: 'think',
        direction: 'right',
        filter: 'hue-rotate(45deg)',
        soundEffectMap: {
            think: {
                soundId: 'beep',
                frameIndex: 0,
                volume: .5,
            }
        }
    },
    {
        id: 'MARIO',
        name: 'Mario',
        type: 'actor',
        room: 'OUTSIDE',
        x: (640 * 1 / 5),
        y: 10,
        width: 40,
        height: 80,
        sprite: 'mario',
        direction: 'right',
    },
    {
        id: 'FIRE',
        type: 'actor',
        room: 'OUTSIDE',
        x: 200,
        y: 10,
        height: 50,
        width: 50,
        sprite: 'fire',
        status: 'out',
        soundEffectMap: {
            burning: { soundId: 'fire' },
        }
    },
    {
        id: 'TUBE',
        type: 'actor',
        room: 'OUTSIDE',
        x: 240,
        y: 10,
        height: 30,
        width: 20,
        sprite: 'tube'
    },
]