import { Point } from "../lib/pathfinding/geometry"
import { Order, ThingOrder } from "./Order"

interface OrderConsequence {
    type: 'order';
    characterId?: string;
    orders: Order[];
    replaceCurrentOrders?: boolean;
}

interface ThingOrderConsequence {
    type: 'thingOrder';
    thingId: string;
    orders: ThingOrder[];
    replaceCurrentOrders?: boolean;
}

interface TalkConsequence {
    type: 'talk';
    characterId?: string;
    text: string;
    time?: number;
}

interface ChangeRoomConsequence {
    type: 'changeRoom';
    roomId: string;
    takePlayer: boolean;
    point?: Point;
}

interface InventoryConsequence {
    type: 'inventory';
    itemId: string;
    characterId?: string;
    addOrRemove: 'ADD' | 'REMOVE';
}

interface RemoveThingConsequence {
    type: 'removeThing';
    thingId: string;
}

interface ChangeStatusConsequence {
    type: 'changeStatus';
    targetId: string;
    targetType: 'character' | 'item' | 'hotspot' | 'thing';
    status: string;
}

interface SequenceConsequence {
    type: 'sequence';
    sequence: string;
}

interface ConversationConsequence {
    type: 'conversation';
    conversationId: string;
    end?: boolean;
}

type Consequence = OrderConsequence | ChangeRoomConsequence
    | TalkConsequence | InventoryConsequence | RemoveThingConsequence
    | ChangeStatusConsequence | SequenceConsequence | ThingOrderConsequence | ConversationConsequence;
type ImmediateConsequence = RemoveThingConsequence | ChangeStatusConsequence | InventoryConsequence | ConversationConsequence;

interface Interaction {
    verbId: string;
    targetId: string;
    targetType?: string; // to do -implement
    roomId?: string;
    itemId?: string;
    targetStatus?: string;
    consequences: Consequence[];
}

export type { Interaction, Consequence, ImmediateConsequence }