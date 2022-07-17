import { CharacterData } from './CharacterData'
import { ItemData } from './ItemData';
import { Verb } from './Verb'
import { HotspotZone } from './Zone'

export type CommandTarget = CharacterData | HotspotZone | ItemData;

export type Command = {
    verb: Verb;
    target: CommandTarget;
    item?: ItemData;
}
