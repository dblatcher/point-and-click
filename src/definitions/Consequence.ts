import { z } from "zod"
import { Order, orderSchema } from "./Order"
import { NarrativeSchema } from "./BaseTypes"

const OrderConsequenceSchema = z.object({
    type: z.literal('order'),
    actorId: z.string().optional(),
    orders: z.array(orderSchema),
    replaceCurrentOrders: z.optional(z.boolean()),
    narrative: NarrativeSchema.optional(),
})
export type OrderConsequence = z.infer<typeof OrderConsequenceSchema>

const ChangeRoomConsequenceSchema = z.object({
    type: z.literal('changeRoom'),
    roomId: z.string(),
    takePlayer: z.boolean(),
    x: z.optional(z.number()),
    y: z.optional(z.number()),
    narrative: NarrativeSchema.optional(),
})

const InventoryConsequenceSchema = z.object({
    type: z.literal('inventory'),
    itemId: z.string(),
    actorId: z.string().optional(),
    addOrRemove: z.enum(['ADD', 'REMOVE']),
    narrative: NarrativeSchema.optional(),
})

const RemoveActorConsequenceSchema = z.object({
    type: z.literal('removeActor'),
    actorId: z.string(),
    narrative: NarrativeSchema.optional(),
})

const ChangeStatusConsequenceSchema = z.object({
    type: z.literal('changeStatus'),
    targetId: z.string(),
    targetType: z.enum(['actor', 'item', 'hotspot']),
    status: z.string(),
    narrative: NarrativeSchema.optional(),
})

const SequenceConsequenceSchema = z.object({
    type: z.literal('sequence'),
    sequence: z.string(),
    narrative: NarrativeSchema.optional(),
})

const ConversationConsequenceSchema = z.object({
    type: z.literal('conversation'),
    conversationId: z.string(),
    end: z.optional(z.boolean()),
    narrative: NarrativeSchema.optional(),
})

const EndingConsequenceSchema = z.object({
    type: z.literal('ending'),
    endingId: z.string(),
    narrative: NarrativeSchema.optional(),
})

const TeleportActorConsequenceSchema = z.object({
    type: z.literal('teleportActor'),
    actorId: z.string(),
    roomId: z.optional(z.string()),
    x: z.number(),
    y: z.number(),
    narrative: NarrativeSchema.optional(),
})

const ToggleZoneConsequenceSchema = z.object({
    type: z.literal('toggleZone'),
    roomId: z.optional(z.string()),
    on: z.boolean(),
    ref: z.string(),
    zoneType: z.enum(['hotspot', 'obstacle', 'walkable']),
    narrative: NarrativeSchema.optional(),
})
export type ZoneType = z.infer<typeof ToggleZoneConsequenceSchema.shape.zoneType>
export const zoneTypes: ZoneType[] = ToggleZoneConsequenceSchema.shape.zoneType.options

const SoundEffectConsequenceSchema = z.object({
    type: z.literal('soundEffect'),
    sound: z.string(),
    volume: z.number().optional(),
    narrative: NarrativeSchema.optional(),
})

const BackgroundMusicConsequenceSchema = z.object({
    type: z.literal('backgroundMusic'),
    sound: z.string().optional(),
    roomId: z.string().optional(),
    volume: z.number().optional(),
    narrative: NarrativeSchema.optional(),
})

const FlagConsequenceSchema = z.object({
    type: z.literal('flag'),
    on: z.boolean(),
    flag: z.string(),
    narrative: NarrativeSchema.optional(),
})

const ConversationChoiceConsequenceSchema = z.object({
    type: z.literal('conversationChoice'),
    on: z.boolean(),
    conversationId: z.string(),
    branchId: z.string(),
    choiceRef: z.string(),
    narrative: NarrativeSchema.optional(),
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
    BackgroundMusicConsequenceSchema,
    FlagConsequenceSchema,
    ConversationChoiceConsequenceSchema,
])

const ConsequenceTypeEnum = z.enum([
    'conversation', 'sequence', 'changeStatus', 'backgroundMusic',
    'removeActor', 'inventory', 'changeRoom', 'order', 'ending',
    'teleportActor', 'toggleZone', 'soundEffect', 'flag', 'conversationChoice', 
])
export type ConsequenceType = z.infer<typeof ConsequenceTypeEnum>
export const consequenceTypes: ConsequenceType[] = ConsequenceTypeEnum.options

export const consequenceMap = {
    conversation: ConversationChoiceConsequenceSchema,
    sequence: SequenceConsequenceSchema,
    changeStatus: ChangeStatusConsequenceSchema,
    removeActor: RemoveActorConsequenceSchema,
    inventory: InventoryConsequenceSchema,
    changeRoom: ChangeRoomConsequenceSchema,
    order: OrderConsequenceSchema,
    ending: EndingConsequenceSchema,
    teleportActor: TeleportActorConsequenceSchema,
    toggleZone: ToggleZoneConsequenceSchema,
    soundEffect: SoundEffectConsequenceSchema,
    flag: FlagConsequenceSchema,
    conversationChoice: ConversationChoiceConsequenceSchema,
    backgroundMusic: BackgroundMusicConsequenceSchema,
} as const

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
    orders?: Order[];

    on?: boolean;
    ref?: string;
    zoneType?: ZoneType;

    sound?: string;
    volume?: number;
    flag?: string;
    branchId?: string;
    choiceRef?: string;
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
    ConversationChoiceConsequenceSchema,
    BackgroundMusicConsequenceSchema,
])
/**
 * The subset of consequences that are don't take multiple cycles
 * to happen - all of them except Orders and Sequences
 */
export type ImmediateConsequence = z.infer<typeof ImmediateConsequenceSchema>
export const immediateConsequenceTypes: ConsequenceType[] = ImmediateConsequenceSchema.options.map(member => member.shape.type.value)
