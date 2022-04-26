import { CharacterData } from './CharacterData'
import { ThingData } from './ThingData'
import { Verb } from './Verb'
import { HotSpotZone } from './Zone'

type CommandTarget = CharacterData | ThingData | HotSpotZone;

interface Command {
    verb: Verb
    target: CommandTarget
    item?: any
}

export type { Command, CommandTarget }