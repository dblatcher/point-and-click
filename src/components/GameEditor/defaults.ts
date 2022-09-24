import { Conversation, RoomData, Verb, Sequence, Consequence, ConsequenceType, Stage, ConversationChoice, Ending, Order, OrderType } from "src";
import { Flag } from "src/definitions/Flag";
import { ActStep, MoveStep } from "src/definitions/Order";

const DEFAULT_TALK_TIME = 250;

export const defaultVerbs1: { (): Verb[] } = () => [
    { id: 'LOOK', label: 'look at' },
    { id: 'TAKE', label: 'pick up' },
    { id: 'USE', label: 'use', preposition: 'with' },
    { id: 'GIVE', label: 'give', preposition: 'to' },
    { id: 'TALK', label: 'talk to' },
]

export const makeBlankVerb: { (): Verb } = () => ({ id: "NEW_VERB", label: "new verb" })

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

    if (type === 'say') {
        return { type, text:'', time: DEFAULT_TALK_TIME}
    }

    return {
        type,
        steps: []
    }
}


export const makeBlankConversationChoice = (text = "...", end?: boolean): ConversationChoice => ({
    text,
    sequence: '',
    end,
})
export const makeBlankConversation = (): Conversation => ({
    id: 'NEW_CONVERSATION',
    defaultBranch: 'start',
    branches: {
        start: {
            choices: [
                makeBlankConversationChoice(),
                makeBlankConversationChoice('goodbye', true),
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

export const makeNewFlag = (): Flag => ({
    value: false, default: false
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
        case 'ending':
            return { type: 'ending', endingId: '' }
        case 'teleportActor':
            return { type: 'teleportActor', actorId: '', x: 0, y: 0, roomId: '' }
        case 'order':
            return { type: 'order', actorId: '', orders: [] }
        case 'toggleZone':
            return { type: 'toggleZone', roomId: '', ref: '', on: true, zoneType: 'obstacle' }
        case 'soundEffect':
            return { type: 'soundEffect', sound: '', volume: 1 }
        case 'flag':
            return { type: 'flag', on: true, flag: '' }
    }
}

export const makeNewStep = {
    act: (): ActStep => ({ duration: 100, reverse: false, animation: '' }),
    move: (): MoveStep => ({ speed: 100, x: 0, y: 0, animation: '' }),
}

export const makeBlankEnding = (id = "NEW_ENDING", message = "game over"): Ending => ({ id, message, })
