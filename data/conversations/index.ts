import { Conversation } from '../../src/definitions/Conversation'

const chat: Conversation = {
    id: 'CHAT',
    defaultBrach: 'hello',
    branches: {
        hello: {
            choices: [
                {
                    text: 'hello there',
                    consequences: [
                        {
                            characterOrders: {
                                PLAYER: [
                                    {
                                        type: 'talk', steps: [
                                            { text: 'hello there', time: 10 },
                                            { text: 'I am doing dialogue', time: 10 },
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
                    consequences: [
                        {
                            characterOrders: {
                                PLAYER: [
                                    {
                                        type: 'talk', steps: [
                                            { text: 'good bye', time: 10 }
                                        ]
                                    }
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