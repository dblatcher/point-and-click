import { Conversation } from '../../src/definitions/Conversation'

const chat: Conversation = {
    id: 'CHAT',
    defaultBrach: 'hello',
    branches: {
        hello: {
            choices: [
                {
                    text: 'hello there',
                    nextBranch: 'hammer',
                    sequence: [
                        {
                            characterOrders: {
                                PLAYER: [
                                    {
                                        type: 'talk', steps: [
                                            { text: 'hello there', time: 100 },
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
        hammer: {
            choices: [
                {
                    text: 'Do you have a hammer?',
                    nextBranch: 'hello',
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