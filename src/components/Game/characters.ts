import { CharacterData } from "../../lib/CharacterData"

export const initialCharacters: CharacterData[] = [
    {
        id:'PLAYER',
        isPlayer: true,
        room:'test-room-2',
        x: (640 / 2),
        y: 10,
        width: 40,
        height: 80,
        orders: [],
        sprite: 'skinner',
        direction: 'left',
        dialogueColor: 'red',
    },
    {
        id:'EVIL_SKINNER',
        room:'test-room-2',
        x: (640 * 2 / 5),
        y: 10,
        width: 40,
        height: 80,
        orders: [
            { type: 'talk', steps: [{ text: 'I am evil skinner...', time: 100 }] },
            { type: 'talk', steps: [{ text: '...I AM evil skinner', time: 100 }] },
            { type: 'move', steps: [{ x: 200, y: 30 }] },
        ],
        sprite: 'skinner',
        direction: 'right',
        filter: 'hue-rotate(45deg)',
    },
    {
        id:'MARIO',
        room:'OUTSIDE',
        x: (640 * 3.5 / 5),
        y: 10,
        width: 40,
        height: 80,
        orders: [],
        sprite: 'mario',
        direction: 'right',
    },
]