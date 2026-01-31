import { Sequence } from "point-click-lib";

export const LIGHT_FIRE: Sequence = {
    id: "LIGHT_FIRE",
    description: "player lights the fire with the matches",
    stages: [
        {
            actorToFollow: 'MARIO',
            actorOrders: {
                PLAYER: [
                    {
                        roomId: 'OUTSIDE',
                        type: 'move', steps: [{
                            x: 240, y: 10
                        }]
                    },
                    {
                        type: 'say', text: 'I wish to light this fire.', time: 150,
                    },
                    {
                        type: 'say', text: 'yes.', time: 50,
                    }
                ],
                MARIO: [
                    {
                        type: 'move',
                        steps: [
                            { x: 400, y: 10 },
                            { x: 390, y: 10 }
                        ]
                    },
                    {
                        type: 'say', text: 'I have gone over here to be away from the fire', time: 150,
                    }
                ]
            }
        },
        {
            actorOrders: {
                PLAYER: [
                    {
                        type: 'say', text: 'here goes...', time: 150,
                    }
                ],
                FIRE: [
                    {
                        type: 'act', endStatus: 'burning', steps: [{
                            duration: 200, animation: 'fade', reverse: true
                        }]
                    },
                ]
            },
        },
        {
            actorOrders: {
                PLAYER: [
                    { type: 'say', text: 'It is burning now.', time: 150 },
                ]
            },
            immediateConsequences: [
            ]
        },
        {
            immediateConsequences: [
            ],
            actorOrders: {
                MARIO: [
                    {
                        type: 'move',
                        steps: [
                            { x: 100, y: 10 },
                        ]
                    }
                ]
            }
        }
    ]
}