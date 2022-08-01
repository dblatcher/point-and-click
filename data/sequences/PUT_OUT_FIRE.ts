import { Sequence } from "../../src/definitions/Sequence";

export const PUT_OUT_FIRE: Sequence = {
    id: "PUT_OUT_FIRE",
    stages: [
        {
            characterOrders: {
                PLAYER: [
                    {
                        type: 'move', steps: [{
                            x: 240, y: 10
                        }]
                    },
                    {
                        type: 'talk', steps: [{
                            text: 'I wish to put it out.', time: 150,
                        }]
                    }
                ]
            }
        },
        {
            characterOrders: {
                PLAYER: [
                    {
                        type: 'talk', steps: [{
                            text: 'ok...', time: 100,
                        }]
                    }
                ],
                FIRE: [
                    {
                        type: 'act', steps: [{
                            duration: 200, animation: 'fade'
                        }]
                    }
                ]
            },
            immediateConsequences: [
                { type: 'changeStatus', targetId: 'FIRE', status: 'out', targetType: 'character' }
            ]
        },
        {
            characterOrders: {
                PLAYER: [
                    {
                        type: 'talk', steps: [{
                            text: 'It is out now.', time: 150,
                        }]
                    }
                ]
            }
        }
    ]
}