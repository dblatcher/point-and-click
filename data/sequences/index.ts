import { Sequence } from "../../src/definitions/Sequence";
import { DIALOGUE } from "./DIALOGUE";
import { LIGHT_FIRE } from "./LIGHT_FIRE";
import { PUT_OUT_FIRE } from "./PUT_OUT_FIRE";

import * as CHAT from "./CONVERSATION_CHAT"

export const sequences: Sequence[] = [
    DIALOGUE, PUT_OUT_FIRE, LIGHT_FIRE,
    ...Object.values(CHAT),
]