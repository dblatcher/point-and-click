import { Interaction } from '../src/definitions/Interaction'

export const interactions: Interaction[] = [
    {
        verbId: 'LOOK',
        targetId: 'fire',
        consequences: [
            {
                type: 'order',
                characterId: 'PLAYER',
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
                characterId: 'PLAYER',
                orders: [
                    {
                        type: 'talk',
                        steps: [
                            {
                                text: 'I am carrying a bucket',
                                time: 100,
                            }
                        ]
                    }
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
                characterId: 'PLAYER',
                text: 'Hello.',
                time: 100,
            },
            {
                type: 'talk',
                characterId: 'MARIO',
                text: 'Itsa me, Mario.',
                time: 100,
            },
        ]
    },
    {
        verbId: 'LOOK',
        targetId: 'sun',
        consequences: [
            {
                type: 'order',
                characterId: 'PLAYER',
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
                roomId: 'test-room-2',
                takePlayer: true,
                point: { y: 5, x: 100 },
            },
            {
                type: 'order',
                characterId: 'PLAYER',
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
        roomId: 'test-room-2',
        consequences: [
            {
                type: 'changeRoom',
                roomId: 'OUTSIDE',
                takePlayer: true,
                point: { y: 12, x: 230 },
            },
            {
                type: 'order',
                characterId: 'PLAYER',
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
]
