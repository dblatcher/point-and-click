import { Interaction } from '../src/definitions/Interaction'

export const interactions: Interaction[] = [
    {
        verbId: 'LOOK',
        targetId: 'FIRE',
        consequences: [
            {
                type: 'order',
                orders: [
                    {
                        type: 'talk',
                        steps: [
                            {
                                text: 'Fire is hot',
                                time: 100,
                            }
                        ]
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
                        type: 'talk',
                        steps: [
                            {
                                time: 300,
                                text: 'I have a bucket!!',
                                animation: 'yell',
                            }
                        ]
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
                type: 'talk',
                text: 'Hello.',
                time: 100,
            },
            {
                type: 'talk',
                characterId: 'MARIO',
                text: 'Itsa me, Mario.',
                time: 100,
            },
            {
                type:'conversation',
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
                        type: 'talk',
                        steps: [
                            {
                                text: 'Looking at the sun is bad for your eyes.',
                                time: 100,
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        verbId: 'USE',
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
                        type: 'talk',
                        steps: [
                            {
                                text: 'I am inside now',
                                time: 100,
                            }
                        ]
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
                        type: 'talk',
                        steps: [
                            {
                                text: 'I am outside again',
                                time: 100,
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        verbId: 'TAKE',
        targetId: 'TUBE',
        consequences: [
            {
                type: 'removeCharacter',
                characterId: 'TUBE',
            },
            {
                type: 'inventory',
                addOrRemove: 'ADD',
                itemId: 'PASTA',
            },
            {
                type: 'talk',
                text: 'I took it.',
            }
        ]
    },

    {
        verbId: 'USE',
        targetId: 'FIRE',
        itemId: 'BUCKET',
        targetStatus: 'out',
        consequences: [
            { type: 'talk', text: 'It is out already' }
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
            { type: 'talk', text: 'It is burning already' }
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
]
