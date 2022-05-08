import { Sequence } from "../../src/definitions/Sequence";
import { DIALOGUE } from "./DIALOGUE";
import { LIGHT_FIRE } from "./LIGHT_FIRE";
import { PUT_OUT_FIRE } from "./PUT_OUT_FIRE";

export const sequences: Record<string, Sequence> = {
    DIALOGUE, PUT_OUT_FIRE, LIGHT_FIRE
}