import { Sequence } from "@/oldsrc/definitions/Sequence";
import { DIALOGUE } from "./DIALOGUE";
import { LIGHT_FIRE } from "./LIGHT_FIRE";
import { PUT_OUT_FIRE } from "./PUT_OUT_FIRE";

import * as CHAT from "./CONVERSATION_CHAT"

export const sequences: Sequence[] = [
    DIALOGUE, PUT_OUT_FIRE, LIGHT_FIRE,
    ...Object.values(CHAT),
    {
        id: 'CHAIN_1',
        stages: [
            {
                actorOrders: {
                    PLAYER: [
                        {
                            type: 'say',
                            text: 'this is sequence one',
                            time: 250,
                        },
                        {
                            type: 'say',
                            text: 'second line',
                            time: 250,
                        },
                        {
                            type:'goTo',
                            targetId:'bush',
                        }
                    ]
                }
            }
        ]
    },
    {
        id: 'CHAIN_2',
        stages: [
            {
                actorOrders: {
                    PLAYER: [
                        {
                            type: 'say',
                            text: 'this is sequence two',
                            time: 250,
                        },
                        {
                            type:'goTo',
                            targetId:'MARIO',
                        }
                    ]
                }
            }
        ]
    },
]