import { Sequence, Stage } from "../../src/definitions/Sequence";

export const Dialogue: Sequence = [
    {
        characterOrders: {
            PLAYER: [
                {
                    type: 'talk',
                    steps: [
                        { text: 'hello', time: 100 },
                        { text: 'I am Skinner', time: 100 },
                    ]
                }
            ]
        }
    },
    {
        characterOrders: {
            EVIL_SKINNER: [
                {
                    type: 'talk',
                    steps: [
                        { text: 'Me too.', time: 100 }
                    ]
                }
            ]
        }
    },
    {
        characterOrders: {
            EVIL_SKINNER: [
                {
                    type: 'talk',
                    steps: [
                        { text: 'ha ha ha ha!', time: 200 }
                    ]
                },
                { type: 'move', steps: [{ x: 200, y: 30 }] },
            ],
            PLAYER: [
                {
                    type: 'talk',
                    steps: [
                        { text: 'nooo', time: 100 },
                    ]
                }
            ]
        }
    },
]