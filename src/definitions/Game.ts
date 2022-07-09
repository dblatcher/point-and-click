import { Interaction } from "./Interaction"
import { ItemData } from "./ItemData"
import { Order, ThingOrder } from "./Order"
import { RoomData } from "./RoomData"
import { Sequence } from "./Sequence"
import { ThingData } from "./ThingData"
import { CharacterData } from "./CharacterData"
import { Verb } from "./Verb"
import { Conversation } from "./Conversation"
import { SpriteData } from "./SpriteSheet"

type GameData = {
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

type FixedGameInfo = {
    verbs: Verb[];
    sequences: Record<string, Sequence>;
    sprites: SpriteData[];
}

type GameCondition = GameData & FixedGameInfo;


export type { GameCondition, GameData, FixedGameInfo }