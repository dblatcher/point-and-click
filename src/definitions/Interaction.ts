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

const InventoryConsequenceSchema = z.object({
    type: z.literal('inventory'),
    itemId: z.string(),
    characterId: z.optional(z.string()),
    addOrRemove: z.enum(['ADD', 'REMOVE']),
})
type InventoryConsequence = z.infer<typeof InventoryConsequenceSchema>

const RemoveCharacterConsequenceSchema = z.object({
    type: z.literal('removeCharacter'),
    characterId: z.string(),
})
type RemoveCharacterConsequence = z.infer<typeof RemoveCharacterConsequenceSchema>;

const ChangeStatusConsequenceSchema = z.object({
    type: z.literal('changeStatus'),
    targetId: z.string(),
    targetType: z.enum(['character', 'item', 'hotspot']),
    status: z.string(),
})
type ChangeStatusConsequence = z.infer<typeof ChangeStatusConsequenceSchema>;

const SequenceConsequenceSchema = z.object({
    type: z.literal('sequence'),
    sequence: z.string(),
})
type SequenceConsequence = z.infer<typeof SequenceConsequenceSchema>;

const ConversationConsequenceSchema = z.object({
    type: z.literal('conversation'),
    conversationId: z.string(),
    end: z.optional(z.boolean()),
})
type ConversationConsequence = z.infer<typeof ConversationConsequenceSchema>;


const ConsequenceTypeEnum = z.enum([
    'conversation', 'sequence', 'changeStatus', 'removeCharacter', 'inventory', 'changeRoom', 'talk', 'order'
])
export type ConsequenceType = z.infer<typeof ConsequenceTypeEnum>
export const consequenceTypes: ConsequenceType[] = ConsequenceTypeEnum.options

export const ConsequenceSchema = z.union([
    OrderConsequenceSchema,
    ChangeRoomConsequenceSchema,
    TalkConsequenceSchema,
    InventoryConsequenceSchema,
    RemoveCharacterConsequenceSchema,
    ChangeStatusConsequenceSchema,
    SequenceConsequenceSchema,
    ConversationConsequenceSchema
])

export type Consequence = z.infer<typeof ConsequenceSchema>

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

export const ImmediateConsequenceSchema = z.union([
    RemoveCharacterConsequenceSchema,
    ChangeStatusConsequenceSchema,
    InventoryConsequenceSchema,
    ConversationConsequenceSchema,
])
export type ImmediateConsequence = RemoveCharacterConsequence |
    ChangeStatusConsequence |
    InventoryConsequence |
    ConversationConsequence;

export const immediateConsequenceTypes: ConsequenceType[] = [
    'removeCharacter', 'changeStatus', 'inventory', 'conversation'
]

export const InteractionSchema = z.object({
    verbId: z.string(),
    targetId: z.string(),
    roomId: z.optional(z.string()),
    itemId: z.optional(z.string()),
    targetStatus: z.optional(z.string()),
    consequences: z.array(ConsequenceSchema),
})

export type Interaction = z.infer<typeof InteractionSchema>