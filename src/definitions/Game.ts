import { Interaction } from "./Interaction"
import { ItemData } from "./ItemData"
import { Order, ThingOrder } from "./Order"
import { RoomData } from "./RoomData"
import { Sequence } from "./Sequence"
import { ThingData } from "./ThingData"
import { CharacterData } from "./CharacterData"
import { Verb } from "./Verb"
import { Conversation } from "./Conversation"
import { SpriteData, SpriteSheet } from "./SpriteSheet"

export type GameData = {
    rooms: RoomData[];
    things: ThingData[];
    characters: CharacterData[];
    interactions: Interaction[];
    items: ItemData[];
    currentRoomId: string;
    characterOrders: Record<string, Order[]>;
    thingOrders: Record<string, ThingOrder[]>;
    sequenceRunning?: Sequence;
    conversations: Conversation[];
    currentConversationId?: string;
}

export type FixedGameInfo = {
    verbs: Verb[];
    sequences: Record<string, Sequence>;
    sprites: SpriteData[];
    spriteSheets: SpriteSheet[];
}

export type GameCondition = GameData & FixedGameInfo;
