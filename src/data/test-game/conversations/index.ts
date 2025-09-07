import { Conversation } from '@/definitions/Conversation'

const chat: Conversation = {
    id: 'CHAT',
    defaultBranch: 'hello',
    branches: {
        hello: {
            choices: [
                {
                    text: 'hello there, lets talk about tools',
                    ref: 'ASK_ABOUT_TOOLS',
                    nextBranch: 'tools',
                    choiceSequence: {
                        id: '',
                        stages: [
                            {
                                actorOrders: {
                                    PLAYER: [
                                        { type: 'say', text: 'hello there, lets talk about tools', time: 100 },
                                        { type: 'say', text: 'I am doing dialogue', time: 100 }
                                    ]
                                }
                            },
                            {
                                actorOrders: {
                                    MARIO: [
                                        { type: 'say', text: 'hello!', time: 100 },
                                    ]
                                }
                            },
                        ]
                    }
                },
                {
                    text: 'hello there, lets talk about fish',
                    nextBranch: 'fish',
                    choiceSequence: {
                        id: "",
                        stages: [
                            {
                                actorOrders: {
                                    PLAYER: [
                                        { type: 'say', text: 'hello there, lets talk about fish', time: 100 },
                                    ]
                                },
                                immediateConsequences: [
                                    { type: 'flag', flag: 'TEST_FLAG_3', on: true },
                                ]
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
                },
                {
                    text: 'good bye',
                    end: true,
                    choiceSequence: {
                        id: "",
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
                },
            ]
        },
        fish: {
            choices: [
                {
                    text: 'forget about fish. good bye',
                    end: true,
                    nextBranch: 'hello',
                },
            ]
        },
        tools: {
            choices: [
                {
                    text: 'Do you have a hammer?',
                    once: true,
                    enablesChoices: [
                        { choiceRef: 'ASK_FOR_HAMMER' },
                    ],
                    disablesChoices: [
                        { choiceRef: 'ASK_ABOUT_TOOLS', branchId: 'hello' }
                    ],
                    choiceSequence: {
                        id: "",
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
                },
                {
                    ref: 'ASK_FOR_HAMMER',
                    text: 'Can I have the hammer?',
                    nextBranch: 'hello',
                    disabled: true,
                    once: true,
                    choiceSequence: {
                        id: "",
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
                },
                {
                    text: 'Do you have a screwdriver?',
                    once: true,
                    choiceSequence: {
                        id: "",
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
                },
                {
                    text: 'Never mind.',
                    nextBranch: 'hello',
                    choiceSequence: {
                        id: "",
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
                },
            ]
        }
    }
}

const conversations = [
    chat
]

export { conversations }