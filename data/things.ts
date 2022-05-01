import { ThingData } from "../src/definitions/ThingData";

export const initialThings: ThingData[] = [
    {
        id: 'FIRE',
        type:'thing',
        room: 'OUTSIDE',
        x: 200,
        y: 10,
        height: 50,
        width: 50,
        sprite: 'fire',
        status:'burning',
    },
    {
        id: 'TUBE',
        type:'thing',
        room: 'OUTSIDE',
        x: 240,
        y: 10,
        height: 30,
        width: 20,
        sprite: 'tube'
    },
]