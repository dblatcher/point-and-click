import { ThingData } from "../src/definitions/ThingData";

export const initialThings: ThingData[] = [
    {
        id: 'fire',
        type:'thing',
        room: 'OUTSIDE',
        x: 200,
        y: 10,
        height: 50,
        width: 50,
        sprite: 'fire'
    },
    {
        id: 'tube',
        type:'thing',
        room: 'OUTSIDE',
        x: 240,
        y: 10,
        height: 30,
        width: 20,
        sprite: 'tube'
    },
]