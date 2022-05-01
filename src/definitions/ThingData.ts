
import { Ident, Position, SpriteParams } from "./BaseTypes"

type ThingData = Ident & Position & SpriteParams & {
    type: 'thing'
}

export type { ThingData }
