import { Conversation } from '../../src/definitions/Conversation'

const chat: Conversation = {
    id: 'CHAT',
    defaultBrach: 'hello',
    branches: {
        hello: {
            choices: [
                {
                    text: 'hello there, lets talk about tools',
                    nextBranch: 'tools',
                    sequence: [
                        {
                            characterOrders: {
                                PLAYER: [
                                    {
                                        type: 'talk', steps: [
                                            { text: 'hello there, lets talk about tools', time: 100 },
                                            { text: 'I am doing dialogue', time: 100 },
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            characterOrders: {
                                MARIO: [
                                    {
                                        type: 'talk', steps: [
                                            { text: 'hello!', time: 100 },
                                        ]
                                    }
                                ]
                            }
                        },
                    ]
                },
                {
                    text: 'good bye',
                    end: true,
                    sequence: [
                        {
                            characterOrders: {
                                PLAYER: [
                                    {
                                        type: 'talk', steps: [
                                            { text: 'good bye', time: 100 }
                                        ]
                                    }
                                ]
                            }
                        },
                    ]
                },
            ]
        },
        tools: {
            choices: [
                {
                    text: 'Do you have a hammer?',
                    once: true,
                    enablesChoices: [
                        ['ASK_HAMMER','tools']
                    ],
                    sequence: [
                        {
                            characterOrders: {
                                PLAYER: [
                                    { type: 'act', steps: [{ animation: 'think', duration: 50 }] },
                                    { type: 'talk', steps: [{ text: 'Do you have a hammer?', time: 100 }] },
                                ]
                            }
                        },
                        {
                            characterOrders: {
                                MARIO: [
                                    { type: 'talk', steps: [{ text: 'Yes.', time: 100 }] },
                                ]
                            }
                        },
                    ]
                },
                {
                    ref: 'ASK_HAMMER',
                    text: 'Can I have the hammer?',
                    disabled: true,
                    once: true,
                    sequence: [
                        {
                            characterOrders: {
                                PLAYER: [
                                    { type: 'talk', steps: [{ text: 'Can I have the hammer?', time: 100 }] },

                                ]
                            }
                        },
                        {
                            characterOrders: {
                                MARIO: [
                                    { type: 'talk', steps: [{ text: 'Here you go.', time: 100 }] },
                                    { type: 'act', steps: [{ animation: 'walk', duration: 150 }] },
                                ]
                            },
                            immediateConsequences: [
                                { type: 'inventory', itemId: 'HAMMER', addOrRemove: 'ADD', }
                            ]
                        },
                    ]
                },
                {
                    text: 'Do you have a screwdriver?',
                    once: true,
                    sequence: [
                        {
                            characterOrders: {
                                PLAYER: [
                                    { type: 'act', steps: [{ animation: 'think', duration: 50 }] },
                                    { type: 'talk', steps: [{ text: 'Do you have a screwdriver?', time: 100 }] },
                                ]
                            }
                        },
                        {
                            characterOrders: {
                                MARIO: [
                                    { type: 'talk', steps: [{ text: 'No.', time: 100 }] },
                                ]
                            }
                        },
                    ]
                },
                {
                    text: 'Never mind.',
                    nextBranch: 'hello',
                    sequence: [
                        {
                            characterOrders: {
                                PLAYER: [
                                    { type: 'talk', steps: [{ text: 'Never mind.', time: 100 }] },
                                ]
                            }
                        },
                    ]
                },
            ]
        }
    }
}

const conversations = [
    chat
]

export { conversations }