import { z } from "zod"
import { Order, orderSchema } from "./Order"

const OrderConsequenceSchema = z.object({
    type: z.literal('order'),
    actorId: z.string().optional(),
    orders: z.array(orderSchema),
    replaceCurrentOrders: z.optional(z.boolean()),
})
export type OrderConsequence = z.infer<typeof OrderConsequenceSchema>

const TalkConsequenceSchema = z.object({
    type: z.literal('talk'),
    actorId: z.string().optional(),
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
    actorId: z.string().optional(),
    addOrRemove: z.enum(['ADD', 'REMOVE']),
})
type InventoryConsequence = z.infer<typeof InventoryConsequenceSchema>

const RemoveActorConsequenceSchema = z.object({
    type: z.literal('removeActor'),
    actorId: z.string(),
})
type RemoveActorConsequence = z.infer<typeof RemoveActorConsequenceSchema>;

const ChangeStatusConsequenceSchema = z.object({
    type: z.literal('changeStatus'),
    targetId: z.string(),
    targetType: z.enum(['actor', 'item', 'hotspot']),
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

const EndingConsequenceSchema = z.object({
    type: z.literal('ending'),
    endingId: z.string(),
})
type EndingConsequence = z.infer<typeof EndingConsequenceSchema>;

const TeleportActorConsequenceSchema = z.object({
    type: z.literal('teleportActor'),
    actorId: z.string(),
    roomId: z.optional(z.string()),
    x: z.number(),
    y: z.number(),
})
type TeleportActorConsequence = z.infer<typeof TeleportActorConsequenceSchema>;

const ToggleZoneConsequenceSchema = z.object({
    type: z.literal('toggleZone'),
    roomId: z.optional(z.string()),
    on: z.boolean(),
    ref: z.string(),
    zoneType: z.enum(['hotspot', 'obstacle', 'walkable']),
})
type ToggleZoneConsequence = z.infer<typeof ToggleZoneConsequenceSchema>;
export type ZoneType = z.infer<typeof ToggleZoneConsequenceSchema.shape.zoneType>
export const zoneTypes: ZoneType[] = ToggleZoneConsequenceSchema.shape.zoneType.options

export const ConsequenceSchema = z.union([
    OrderConsequenceSchema,
    ChangeRoomConsequenceSchema,
    TalkConsequenceSchema,
    InventoryConsequenceSchema,
    RemoveActorConsequenceSchema,
    ChangeStatusConsequenceSchema,
    SequenceConsequenceSchema,
    ConversationConsequenceSchema,
    EndingConsequenceSchema,
    TeleportActorConsequenceSchema,
    ToggleZoneConsequenceSchema,
])

const ConsequenceTypeEnum = z.enum([
    'conversation', 'sequence', 'changeStatus',
    'removeActor', 'inventory', 'changeRoom', 'talk', 'order', 'ending',
    'teleportActor', 'toggleZone'
])
export type ConsequenceType = z.infer<typeof ConsequenceTypeEnum>
export const consequenceTypes: ConsequenceType[] = ConsequenceTypeEnum.options




export type Consequence = z.infer<typeof ConsequenceSchema>

export type AnyConsequence = Consequence & {
    conversationId?: string;
    sequence?: string;
    targetId?: string;
    itemId?: string;
    status?: string;
    actorId?: string;
    endingId?: string;
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

    on?: boolean;
    ref?: string;
    zoneType?: ZoneType;
}

export const ImmediateConsequenceSchema = z.union([
    RemoveActorConsequenceSchema,
    ChangeStatusConsequenceSchema,
    InventoryConsequenceSchema,
    ConversationConsequenceSchema,
    EndingConsequenceSchema,
    TeleportActorConsequenceSchema,
    ToggleZoneConsequenceSchema,
])
export type ImmediateConsequence = RemoveActorConsequence |
    ChangeStatusConsequence |
    InventoryConsequence |
    ConversationConsequence |
    EndingConsequence |
    TeleportActorConsequence |
    ToggleZoneConsequence;

export const immediateConsequenceTypes: ConsequenceType[] = [
    'removeActor', 'changeStatus', 'inventory', 'conversation', 'ending', 'teleportActor', 'toggleZone'
]

export const InteractionSchema = z.object({
    verbId: z.string(),
    targetId: z.string(),
    roomId: z.string().optional(),
    itemId: z.string().optional(),
    targetStatus: z.string().optional(),
    mustReachFirst: z.boolean().optional(),
    consequences: z.array(ConsequenceSchema),
})

export type Interaction = z.infer<typeof InteractionSchema>