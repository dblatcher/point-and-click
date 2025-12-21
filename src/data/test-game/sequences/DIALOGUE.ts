import { Sequence } from "point-click-lib";

export const DIALOGUE: Sequence = {
    id: "DIALOGUE",
    description: "Skinner talks to his doppleganger.",
    stages: [
        {
            actorOrders: {
                PLAYER: [
                    {
                        type: 'move',
                        roomId: 'OUTSIDE',
                        steps: [
                            { x: 350, y: 30, animation: 'run', speed: 2 },
                            { x: 340, y: 30, animation: 'run' },
                        ]
                    }

                ]
            }
        },
        {
            actorOrders: {
                PLAYER: [
                    { type: 'say', time: 100, text: 'hello' },
                    { type: 'say', time: 100, text: 'I am Skinner' },
                ],
                FAKE_PLAYER_NO_ORDERS: [

                ],
                FAKE_PLAYER_WITH_ORDERS: [
                    { type: 'say', time: 100, text: 'hello' },
                ],
            }
        },
        {
            actorOrders: {
                EVIL_SKINNER: [
                    { type: 'say', time: 100, text: 'Me too.' },
                ]
            }
        },
        {
            actorOrders: {
                EVIL_SKINNER: [
                    { type: 'say', time: 120, text: 'ha ha ha ha!' },
                    { type: 'move', roomId: 'INSIDE', steps: [{ x: 200, y: 30 }] },
                ],
                PLAYER: [
                    { type: 'say', time: 200, text: 'Noooo!', animation: 'yell' },
                ]
            }
        },
    ]
}