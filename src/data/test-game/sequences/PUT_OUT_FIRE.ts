import { Sequence } from "point-click-lib";

export const PUT_OUT_FIRE: Sequence = {
    id: "PUT_OUT_FIRE",
    stages: [
        {
            actorOrders: {
                PLAYER: [
                    {
                        roomId: 'OUTSIDE',
                        type: 'move', steps: [{
                            x: 240, y: 10
                        }]
                    },
                    { type: 'say', text: 'I wish to put it out.', time: 150 },
                ]
            }
        },
        {
            actorOrders: {
                PLAYER: [
                    { type: 'say', text: 'ok...', time: 100 },
                ],
                FIRE: [
                    {
                        type: 'act', steps: [{
                            duration: 200, animation: 'fade'
                        }], endStatus: 'out'
                    }
                ]
            },
            immediateConsequences: [
                // { type: 'changeStatus', targetId: 'FIRE', status: 'out', targetType: 'actor' }
            ]
        },
        {
            actorOrders: {
                PLAYER: [
                    { type: 'say', text: 'It is out now.', time: 150 },
                ]
            }
        }
    ]
}