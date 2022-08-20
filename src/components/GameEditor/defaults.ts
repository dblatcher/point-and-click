import { Order, OrderType } from "src/definitions/Order";
import { Conversation, RoomData, Verb, Sequence, Consequence, ConsequenceType, Stage, ConversationChoice, ConversationBranch, Ending } from "src";
import { ImmediateConsequence } from "src/definitions/Interaction";


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


export const makeBlankConversationChoice = (text = "ENTER CHOICE TEXT"): ConversationChoice => ({
    text,
    sequence: '',
})
export const makeBlankConversation = (): Conversation => ({
    id: 'NEW_CONVERSATION',
    defaultBranch: 'start',
    branches: {
        start: {
            choices: [
                makeBlankConversationChoice()
            ]
        }
    }
})

export const makeBlankStage = (): Stage => ({
    actorOrders: {},
    immediateConsequences: [],
})

export const makeBlankSequence = (id = "NEW_SEQEUNCE"): Sequence => ({
    id,
    description: "",
    stages: [
        makeBlankStage()
    ]
})

export function makeNewConsequence(type: ConsequenceType): Consequence {
    switch (type) {
        case 'conversation':
            return { type: 'conversation', conversationId: '' }
        case 'sequence':
            return { type: 'sequence', sequence: '' }
        case 'changeStatus':
            return { type: 'changeStatus', targetId: '', status: '', targetType: 'actor' }
        case 'removeActor':
            return { type: 'removeActor', actorId: '' }
        case 'inventory':
            return { type: "inventory", itemId: '', addOrRemove: 'ADD' }
        case 'changeRoom':
            return { type: 'changeRoom', roomId: '', takePlayer: true, x: 0, y: 0 }
        case 'talk':
            return { type: 'talk', text: '', actorId: '', time: 100 }
        case 'ending':
            return { type: 'ending', endingId: '' }
        case 'teleportActor':
            return { type: 'teleportActor', actorId: '', x: 0, y: 0, roomId: '' }
        case 'order':
        default:
            return { type: 'order', orders: [] }
    }
}

export const makeBlankEnding = (id = "NEW_ENDING", message = "game over"): Ending => ({ id, message, })
