import { z } from "zod"
import { Order, orderSchema } from "./Order"

const OrderConsequenceSchema = z.object({
    type: z.literal('order'),
    actorId: z.string().optional(),
    orders: z.array(orderSchema),
    replaceCurrentOrders: z.optional(z.boolean()),
})
export type OrderConsequence = z.infer<typeof OrderConsequenceSchema>

const ChangeRoomConsequenceSchema = z.object({
    type: z.literal('changeRoom'),
    roomId: z.string(),
    takePlayer: z.boolean(),
    x: z.optional(z.number()),
    y: z.optional(z.number()),
})

const InventoryConsequenceSchema = z.object({
    type: z.literal('inventory'),
    itemId: z.string(),
    actorId: z.string().optional(),
    addOrRemove: z.enum(['ADD', 'REMOVE']),
})

const RemoveActorConsequenceSchema = z.object({
    type: z.literal('removeActor'),
    actorId: z.string(),
})

const ChangeStatusConsequenceSchema = z.object({
    type: z.literal('changeStatus'),
    targetId: z.string(),
    targetType: z.enum(['actor', 'item', 'hotspot']),
    status: z.string(),
})

const SequenceConsequenceSchema = z.object({
    type: z.literal('sequence'),
    sequence: z.string(),
})

const ConversationConsequenceSchema = z.object({
    type: z.literal('conversation'),
    conversationId: z.string(),
    end: z.optional(z.boolean()),
})

const EndingConsequenceSchema = z.object({
    type: z.literal('ending'),
    endingId: z.string(),
})

const TeleportActorConsequenceSchema = z.object({
    type: z.literal('teleportActor'),
    actorId: z.string(),
    roomId: z.optional(z.string()),
    x: z.number(),
    y: z.number(),
})

const ToggleZoneConsequenceSchema = z.object({
    type: z.literal('toggleZone'),
    roomId: z.optional(z.string()),
    on: z.boolean(),
    ref: z.string(),
    zoneType: z.enum(['hotspot', 'obstacle', 'walkable']),
})
export type ZoneType = z.infer<typeof ToggleZoneConsequenceSchema.shape.zoneType>
export const zoneTypes: ZoneType[] = ToggleZoneConsequenceSchema.shape.zoneType.options

const SoundEffectConsequenceSchema = z.object({
    type: z.literal('soundEffect'),
    sound: z.string(),
    volume: z.number().optional(),
})

const FlagConsequenceSchema = z.object({
    type: z.literal('flag'),
    on: z.boolean(),
    flag: z.string(),
})

export const ConsequenceSchema = z.union([
    OrderConsequenceSchema,
    ChangeRoomConsequenceSchema,
    InventoryConsequenceSchema,
    RemoveActorConsequenceSchema,
    ChangeStatusConsequenceSchema,
    SequenceConsequenceSchema,
    ConversationConsequenceSchema,
    EndingConsequenceSchema,
    TeleportActorConsequenceSchema,
    ToggleZoneConsequenceSchema,
    SoundEffectConsequenceSchema,
    FlagConsequenceSchema,
])

const ConsequenceTypeEnum = z.enum([
    'conversation', 'sequence', 'changeStatus',
    'removeActor', 'inventory', 'changeRoom', 'order', 'ending',
    'teleportActor', 'toggleZone', 'soundEffect', 'flag'
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

    sound?: string;
    volume?: number;
    flag?: string;
}

export const ImmediateConsequenceSchema = z.union([
    RemoveActorConsequenceSchema,
    ChangeStatusConsequenceSchema,
    InventoryConsequenceSchema,
    ConversationConsequenceSchema,
    EndingConsequenceSchema,
    TeleportActorConsequenceSchema,
    ToggleZoneConsequenceSchema,
    SoundEffectConsequenceSchema,
    FlagConsequenceSchema,
    ChangeRoomConsequenceSchema,
])
export type ImmediateConsequence = z.infer<typeof ImmediateConsequenceSchema>
export const immediateConsequenceTypes: ConsequenceType[] = ImmediateConsequenceSchema.options.map(member => member.shape.type.value)
