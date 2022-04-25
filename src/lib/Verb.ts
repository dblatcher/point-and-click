import { BaseData } from './ThingData'
import { HotSpotZone } from './Zone'

interface Verb {
    id: string
    label: string
    preposition?: string
}

interface Command {
    verb: Verb
    target: BaseData | HotSpotZone
    item?: any
}

export type { Verb, Command }