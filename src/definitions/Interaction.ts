import { z } from "zod"
import { Order, orderSchema } from "./Order"

const OrderConsequenceSchema = z.object({
    type: z.literal('order'),
    characterId: z.optional(z.string()),
    orders: z.array(orderSchema),
    replaceCurrentOrders: z.optional(z.boolean()),
})

type OrderConsequence = z.infer<typeof OrderConsequenceSchema>

const TalkConsequenceSchema = z.object({
    type: z.literal('talk'),
    characterId: z.optional(z.string()),
    text: z.string(),
    time: z.optional(z.number()),

})
type TalkConsequence = z.infer<typeof TalkConsequenceSchema>

const ChangeRoomConsequenceSchema = z.object({
    type: z.literal('changeRoom'),
    roomId: z.string(),
    takePlayer: z.boolean(),
    x: z.optional(z.number()),
    y: z.optional(z.number()),
})
type ChangeRoomConsequence = z.infer<typeof ChangeRoomConsequenceSchema>


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
    x?: number;
    y?: number;
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