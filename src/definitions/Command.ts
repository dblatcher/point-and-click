import { CharacterData } from './CharacterData'
import { ItemData } from './ItemData';
import { ThingData } from './ThingData'
import { Verb } from './Verb'
import { HotSpotZone } from './Zone'

type CommandTarget = CharacterData | ThingData | HotSpotZone | ItemData;

interface Command {
    verb: Verb
    target: CommandTarget
    item?: ItemData
}

export type { Command, CommandTarget }