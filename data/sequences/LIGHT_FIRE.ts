import { Sequence } from "../../src/definitions/Sequence";

export const LIGHT_FIRE: Sequence = {
    id:"LIGHT_FIRE",
    description:"player lights the fire with the matches",
    stages: [
        {
            actorOrders: {
                PLAYER: [
                    {
                        type: 'move', steps: [{
                            x: 240, y: 10
                        }]
                    },
                    {
                        type: 'talk', steps: [{
                            text: 'I wish to light this fire.', time: 150,
                        }]
                    }
                ]
            }
        },
        {
            actorOrders: {
                PLAYER: [
                    {
                        type: 'talk', steps: [{
                            text: 'here goes...', time: 150,
                        }]
                    }
                ],
                FIRE: [
                    {
                        type: 'act', steps: [{
                            duration: 200, animation: 'fade', reverse: true
                        }]
                    },
                ]
            },
        },
        {
            actorOrders: {
                PLAYER: [
                    {
                        type: 'talk', steps: [{
                            text: 'It is burning now.', time: 150,
                        }]
                    }
                ]
            },
            immediateConsequences: [
                { type: 'changeStatus', targetId: 'FIRE', status: 'burning', targetType: 'actor' }
            ]
        }
    ]
}