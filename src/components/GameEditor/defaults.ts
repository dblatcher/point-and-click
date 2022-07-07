import { RoomData } from "../../definitions/RoomData";
import { Verb } from "../../definitions/Verb";

export const defaultVerbs1: { (): Verb[] } = () => [
    { id: 'LOOK', label: 'Look at' },
    { id: 'TAKE', label: 'Pick up' },
    { id: 'USE', label: 'use', preposition: 'with' },
    { id: 'GIVE', label: 'give', preposition: 'to' },
    { id: 'TALK', label: 'Talk to' },
]

export const getBlankRoom: { (): RoomData } = () => ({
    id: '_NEW_ROOM',
    frameWidth: 200,
    width: 400,
    height: 200,
    background: [],
    hotspots: [
    ],
    obstacleAreas: [
    ],
    scaling: [
        [0, 1],
    ]
})
