import { CharacterData } from "../../lib/CharacterData"

export const initialCharacters: CharacterData[] = [
    {
        isPlayer: true,
        x: (640 / 2),
        y: 10,
        width: 40,
        height: 80,
        orders: [],
        sprite: 'skinner',
        direction: 'left',
    },
    {
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
        x: (640 * 3 / 5),
        y: 10,
        width: 40,
        height: 80,
        orders: [],
        sprite: 'skinner',
        direction: 'right',
        filter: 'invert(1)',
    },
]