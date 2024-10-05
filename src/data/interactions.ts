import { Interaction } from '@/definitions/Interaction'

export const interactions: Interaction[] = [
    {
        verbId: 'LOOK',
        targetId: 'FIRE',
        consequences: [
            {
                type: 'order',
                orders: [
                    {
                        type: 'say',
                        text: 'Fire is hot',
                        time: 100,
                    }
                ]
            }
        ]
    },
    {
        verbId: 'LOOK',
        targetId: 'BUCKET',
        consequences: [
            {
                type: 'order',
                orders: [
                    {
                        type: 'act',
                        steps: [
                            {
                                duration: 200,
                                animation: 'think',
                            }
                        ],
                        narrative: {
                            text: [
                                'You consider the bucket deeply.',
                                'Having this item is a mystery.',
                            ]
                        }
                    },
                    {
                        type: 'say',
                        time: 300,
                        text: 'I have a bucket!!',
                        animation: 'yell',
                    },
                ]
            }
        ]
    },
    {
        verbId: 'TALK',
        targetId: 'MARIO',
        consequences: [
            {
                type: 'order', orders: [
                    {
                        type: 'say',
                        text: 'Hello.',
                        time: 100,
                    }
                ]
            },
            {
                type: 'order', actorId: 'MARIO', orders: [
                    {
                        type: 'say',
                        text: 'Itsa me, Mario.',
                        time: 100,
                    }
                ]
            },
            {
                type: 'conversation',
                conversationId: 'CHAT'
            }
        ]
    },
    {
        verbId: 'TALK',
        targetId: 'EVIL_SKINNER',
        consequences: [
            {
                type: 'sequence',
                sequence: 'DIALOGUE',
            }
        ]
    },
    {
        verbId: 'LOOK',
        targetId: 'sun',
        consequences: [
            {
                type: 'order',
                orders: [
                    {
                        type: 'say',
                        text: 'Looking at the sun is bad for your eyes.',
                        time: 100,
                    }
                ]
            }
        ]
    },
    {
        verbId: 'WALK',
        targetId: 'bush',
        roomId: 'OUTSIDE',
        consequences: [
            {
                type: 'changeRoom',
                roomId: 'INSIDE',
                takePlayer: true,
                y: 5, x: 100,
                narrative: {
                    text: [
                        'You push through the bush and find a path leading into a wall with an open window.',
                        'You climb inside.'
                    ]
                }
            },
            {
                type: 'order',
                orders: [
                    {
                        type: 'say',
                        text: 'I am inside now',
                        time: 100,
                    }
                ]
            }
        ]
    },
    {
        verbId: 'USE',
        targetId: 'window',
        roomId: 'INSIDE',
        consequences: [
            {
                type: 'changeRoom',
                roomId: 'OUTSIDE',
                takePlayer: true,
                y: 12, x: 230,
                narrative: {
                    text: [
                        'You clamber back out of the window.'
                    ]
                }
            },
            {
                type: 'order',
                orders: [
                    {
                        type: 'say',
                        text: 'I am outside again',
                        time: 100,
                    }
                ]
            }
        ]
    },
    {
        verbId: 'TAKE',
        targetId: 'sun',
        mustReachFirst: true,
        consequences: [
            {
                type: 'order', orders: [
                    {
                        type: 'say',
                        text: 'I cannot take the sun.',
                        time: 100,
                    }
                ]
            },
        ]
    },
    {
        verbId: 'TAKE',
        targetId: 'flag',
        mustReachFirst: true,
        consequences: [
            {
                type: 'order', orders: [
                    {
                        type: 'say',
                        text: '[SHOULD NOt BE SEEN because this target is out of reach]',
                        time: 100,
                    }
                ]
            },
        ]
    },
    {
        verbId: 'TAKE',
        targetId: 'TUBE',
        mustReachFirst: true,
        flagsThatMustBeFalse: ['testFlag'],
        consequences: [
            {
                type: 'order', orders: [
                    {
                        type: 'say',
                        text: 'I cannot because of the test flag.',
                        time: 100,
                    }
                ]
            },
            {
                type: 'soundEffect',
                sound: 'beep',
                volume: 1,
            },
        ]
    },
    {
        verbId: 'TAKE',
        targetId: 'TUBE',
        mustReachFirst: true,
        flagsThatMustBeTrue: ['testFlag'],
        consequences: [
            {
                type: 'removeActor',
                actorId: 'TUBE',
            },
            {
                type: 'inventory',
                addOrRemove: 'ADD',
                itemId: 'PASTA',
            },
            {
                type: 'order', orders: [
                    {
                        type: 'say',
                        text: 'I took it.',
                        time: 250,
                    }
                ]
            },
            {
                type: 'soundEffect',
                sound: 'beep',
                volume: 1,
            },
        ]
    },

    {
        verbId: 'USE',
        targetId: 'FIRE',
        itemId: 'BUCKET',
        targetStatus: 'out',
        consequences: [
            {
                type: 'order', orders: [
                    {
                        type: 'say',
                        text: 'It is out already',
                        time: 250,
                    }
                ]
            },
        ]
    },
    {
        verbId: 'USE',
        targetId: 'FIRE',
        itemId: 'BUCKET',
        consequences: [
            { type: 'sequence', sequence: 'PUT_OUT_FIRE' }
        ]
    },
    {
        verbId: 'USE',
        targetId: 'FIRE',
        itemId: 'MATCHES',
        targetStatus: 'burning',
        consequences: [
            {
                type: 'order', orders: [
                    {
                        type: 'say',
                        text: 'It is burning already',
                        time: 250,
                    }
                ]
            },
        ]
    },
    {
        verbId: 'USE',
        targetId: 'FIRE',
        itemId: 'MATCHES',
        mustReachFirst: true,
        consequences: [
            {
                type: 'sequence',
                sequence: 'LIGHT_FIRE',
                narrative: {
                    text: [
                        'You take the matches out and strike one on the box, then hold the tiny flame to the kindling.'
                    ]
                }
            }
        ]
    },
    {
        verbId: 'TALK',
        targetId: 'FIRE',
        consequences: [
            {
                type: 'order', orders: [
                    {
                        type: 'say',
                        text: 'this will end the game',
                        time: 250,
                    }
                ]
            },
            { type: 'ending', endingId: 'WIN' },
        ]
    },
    {
        verbId: 'PUSH',
        targetId: 'MARIO',
        mustReachFirst: true,
        consequences: [
            {
                type: 'order', actorId: 'MARIO', orders: [
                    {
                        type: 'goTo',
                        targetId: 'FIRE',
                        narrative: {
                            text: [
                                'Mario stumbles towards the fire. After regaining his composure, he wanders back to the bush he was sanding near before you shoved him.'
                            ]
                        }
                    },
                    {
                        type: 'goTo',
                        targetId: 'bush',
                        narrative: {
                            text: []
                        },
                    },
                ],
            },
        ]
    },
    {
        verbId: 'TALK',
        targetId: 'BUCKET',
        consequences: [
            { type: 'sequence', sequence: 'CHAIN_1' },
            { type: 'sequence', sequence: 'CHAIN_2' }
        ]
    },
    {
        verbId: 'PUSH',
        targetId: 'DOLL',
        mustReachFirst: true,
        consequences: [
            {
                type: 'order', orders: [
                    {
                        type: 'say',
                        text: 'turning',
                        time: 150,
                    }
                ]
            },
            { type: 'changeStatus', targetId: 'DOLL', status: 'BACKWARDS', targetType: 'actor' }
        ]
    },
    {
        verbId: 'TALK',
        targetId: 'DOLL',
        mustReachFirst: true,
        consequences: [
            {
                type: 'order', orders: [
                    {
                        type: 'say',
                        text: 'turning back',
                        time: 150,
                    }
                ]
            },
            { type: 'changeStatus', targetId: 'DOLL', status: 'default', targetType: 'actor' }
        ]
    },
]
