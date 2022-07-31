import { Order, OrderType } from "src/definitions/Order";
import { Conversation, RoomData, Verb, Sequence, Consequence, ConsequenceType } from "src";


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

export function makeNewConsequence(type: ConsequenceType): Consequence {
    switch (type) {
        case 'conversation':
            return { type: 'conversation', conversationId: '' }
        case 'sequence':
            return { type: 'sequence', sequence: '' }
        case 'changeStatus':
            return { type: 'changeStatus', targetId: '', status: '', targetType: 'character' }
        case 'removeCharacter':
            return { type: 'removeCharacter', characterId: '' }
        case 'inventory':
            return { type: "inventory", itemId: '', addOrRemove: 'ADD' }
        case 'changeRoom':
            return { type: 'changeRoom', roomId: '', takePlayer: true, x: 0, y: 0 }
        case 'talk':
            return { type: 'talk', text: '', characterId: '', time: 100 }
        case 'order':
        default:
            return { type: 'order', orders: [] }
    }
}