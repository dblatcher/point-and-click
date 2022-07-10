import { Interaction } from "./Interaction"
import { ItemData } from "./ItemData"
import { Order } from "./Order"
import { RoomData } from "./RoomData"
import { Sequence } from "./Sequence"
import { CharacterData } from "./CharacterData"
import { Verb } from "./Verb"
import { Conversation } from "./Conversation"
import { SpriteData, SpriteSheet } from "./SpriteSheet"

export type GameData = {
    rooms: RoomData[];
    characters: CharacterData[];
    items: ItemData[];
    interactions: Interaction[];
    conversations: Conversation[];
    characterOrders: Record<string, Order[]>;
    currentRoomId: string;
    sequenceRunning?: Sequence;
    currentConversationId?: string;
}

export type FixedGameInfo = {
    verbs: Verb[];
    sequences: Record<string, Sequence>;
    sprites: SpriteData[];
    spriteSheets: SpriteSheet[];
}

export type GameCondition = GameData & FixedGameInfo;
