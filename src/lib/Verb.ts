import { CharacterData } from './CharacterData'
import { ThingData } from './ThingData'
import { HotSpotZone } from './Zone'

interface Verb {
    id: string
    label: string
    preposition?: string
}

interface Command {
    verb: Verb
    target: CharacterData | ThingData | HotSpotZone
    item?: any
}

export type { Verb, Command }