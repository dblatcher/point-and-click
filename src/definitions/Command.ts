import { CharacterData } from './CharacterData'
import { ItemData } from './ItemData';
import { Verb } from './Verb'
import { HotspotZone } from './Zone'

type CommandTarget = CharacterData | HotspotZone | ItemData;

interface Command {
    verb: Verb;
    target: CommandTarget;
    item?: ItemData;
}

export type { Command, CommandTarget }