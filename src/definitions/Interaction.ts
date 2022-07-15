import { Point } from "../lib/pathfinding/geometry"
import { Order } from "./Order"

interface OrderConsequence {
    type: 'order';
    characterId?: string;
    orders: Order[];
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

interface RemoveCharacterConsequence {
    type: 'removeCharacter';
    characterId: string;
}

interface ChangeStatusConsequence {
    type: 'changeStatus';
    targetId: string;
    targetType: 'character' | 'item' | 'hotspot';
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

export type ConsequenceType = 'conversation' | 'sequence' | 'changeStatus' | 'removeCharacter' | 'inventory' | 'changeRoom' | 'talk' | 'order'
export const consequenceTypes = [
    'conversation', 'sequence', 'changeStatus', 'removeCharacter', 'inventory', 'changeRoom', 'talk', 'order'
]

export type Consequence = OrderConsequence |
    ChangeRoomConsequence |
    TalkConsequence |
    InventoryConsequence |
    RemoveCharacterConsequence |
    ChangeStatusConsequence |
    SequenceConsequence |
    ConversationConsequence;

export type AnyConsequence = Consequence & {
    conversationId?: string;
    sequence?: string;
    targetId?: string;
    itemId?: string;
    status?: string;
    characterId?: string;
    roomId?: string;
    text?: string;
    targetType?: string;
    addOrRemove?: string;
    end?: boolean;
    takePlayer?: boolean;
    replaceCurrentOrders?: boolean;
    time?: number;
    point?: Point;
    orders: Order[];
}

export type ImmediateConsequence = RemoveCharacterConsequence |
    ChangeStatusConsequence |
    InventoryConsequence |
    ConversationConsequence;

export interface Interaction {
    verbId: string;
    targetId: string;
    roomId?: string;
    itemId?: string;
    targetStatus?: string;
    consequences: Consequence[];
}