import { Ident } from "./BaseTypes"

type ItemData = Ident & {
    type: 'item'
    characterId?: string
}

export type { ItemData }