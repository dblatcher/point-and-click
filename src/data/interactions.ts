import { Interaction } from '@/oldsrc/definitions/Interaction'

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
                        ]
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
                        text: 'I took the sun. Really...[SHOULD NOt BE SEEN]',
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
        flagsThatMustBeFalse: ['testFlag', 'flagThatDoesNotExist'],
        flagsThatMustBeTrue: ['otherFlagThatDoesNotExist'],
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
        consequences: [
            { type: 'sequence', sequence: 'LIGHT_FIRE' }
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
                type: 'order', actorId:'MARIO', orders: [
                    {
                        type: 'goTo',
                        targetId: 'FIRE',
                    },
                    {
                        type: 'goTo',
                        targetId: 'bush',
                    },
                ]
            }
        ]
    },
    {
        verbId: 'TALK',
        targetId: 'BUCKET',
        consequences: [
            {type:'sequence', sequence:'CHAIN_1'},
            {type:'sequence', sequence:'CHAIN_2'}
        ]
    }
]
