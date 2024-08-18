import { Sequence } from "@/definitions/Sequence";

const CHAT_HELLO_1: Sequence = {
    id: "CHAT_HELLO_1",
    stages: [
        {
            actorOrders: {
                PLAYER: [
                    { type: 'say', text: 'good bye', time: 100 }
                ]
            }
        },
    ]
}

const CHAT_HELLO_2: Sequence = {
    id: "CHAT_HELLO_2",
    stages: [
        {
            actorOrders: {
                PLAYER: [
                    { type: 'say', text: 'hello there, lets talk about fish', time: 100 },
                ]
            }
        },
        {
            actorOrders: {
                MARIO: [
                    { type: 'say', text: 'fish?', time: 100 },
                ]
            }
        },
    ]
}

const CHAT_TOOLS_0: Sequence = {
    id: "CHAT_TOOLS_0",
    stages: [
        {
            actorOrders: {
                PLAYER: [
                    { type: 'act', steps: [{ animation: 'think', duration: 50 }] },
                    { type: 'say', text: 'Do you have a hammer?', time: 100 },
                ]
            }
        },
        {
            actorOrders: {
                MARIO: [
                    { type: 'say', text: 'Yes.', time: 100 },
                ]
            }
        },
    ]
}

const CHAT_TOOLS_1: Sequence = {
    id: "CHAT_TOOLS_1",
    stages: [
        {
            actorOrders: {
                PLAYER: [
                    { type: 'say', text: 'Can I have the hammer?', time: 100 },
                ]
            }
        },
        {
            actorOrders: {
                MARIO: [
                    { type: 'say', text: 'Here you go.', time: 100 },
                    { type: 'act', steps: [{ animation: 'walk', duration: 150 }] },
                ]
            },
            immediateConsequences: [
                { type: 'inventory', itemId: 'HAMMER', addOrRemove: 'ADD', }
            ]
        },
    ]
}

const CHAT_TOOLS_2: Sequence = {
    id: "CHAT_TOOLS_2",
    stages: [
        {
            actorOrders: {
                PLAYER: [
                    { type: 'act', steps: [{ animation: 'think', duration: 50 }] },
                    { type: 'say', text: 'Do you have a screwdriver?', time: 100 },
                ]
            }
        },
        {
            actorOrders: {
                MARIO: [
                    { type: 'say', text: 'No.', time: 100 },
                ]
            }
        },
    ]
}

const CHAT_TOOLS_3: Sequence = {
    id: "CHAT_TOOLS_3",
    stages: [
        {
            actorOrders: {
                PLAYER: [
                    { type: 'say', text: 'Never mind.', time: 100 },
                ]
            }
        },
    ]
}

export {
    CHAT_HELLO_1, CHAT_HELLO_2, CHAT_TOOLS_0, CHAT_TOOLS_1, CHAT_TOOLS_2, CHAT_TOOLS_3
}