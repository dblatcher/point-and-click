import { Order, OrderType } from "src/definitions/Order";
import { Conversation, RoomData, Verb, Sequence } from "src";


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

export const getDefaultOrder = (type: OrderType): Order => {
    return {
        type,
        steps: []
    }
}

export const makeBlankConversation = (): Conversation => ({
    id: 'NEW_CONVERSATION',
    defaultBranch: 'start',
    branches: {
        start: {
            choices: [
                {
                    text: "ENTER CHOICE TEXT",
                    sequence: '',
                }
            ]
        }
    }
})

export const makeBlankSequence = (): Sequence => ({
    description: "",
    stages: [
        {
            characterOrders: {},
            immediateConsequences: [],
        }
    ]
})