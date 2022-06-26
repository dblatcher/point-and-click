import { CharacterData } from './CharacterData'
import { ItemData } from './ItemData';
import { ThingData } from './ThingData'
import { Verb } from './Verb'
import { HotspotZone } from './Zone'

type CommandTarget = CharacterData | ThingData | HotspotZone | ItemData;

interface Command {
    verb: Verb;
    target: CommandTarget;
    item?: ItemData;
}

export type { Command, CommandTarget }