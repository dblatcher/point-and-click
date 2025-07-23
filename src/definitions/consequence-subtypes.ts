import { z } from "zod"
import { NarrativeSchema } from "./BaseTypes"
import { orderSchema } from "./Order"

export const OrderConsequenceSchema = z.object({
    type: z.literal('order'),
    actorId: z.string().optional(),
    orders: z.array(orderSchema),
    replaceCurrentOrders: z.optional(z.boolean()),
    narrative: NarrativeSchema.optional(),
})

export const ChangeRoomConsequenceSchema = z.object({
    type: z.literal('changeRoom'),
    roomId: z.string(),
    takePlayer: z.boolean(),
    x: z.optional(z.number()),
    y: z.optional(z.number()),
    narrative: NarrativeSchema.optional(),
})

export const InventoryConsequenceSchema = z.object({
    type: z.literal('inventory'),
    itemId: z.string(),
    actorId: z.string().optional(),
    addOrRemove: z.enum(['ADD', 'REMOVE']),
    narrative: NarrativeSchema.optional(),
})

export const RemoveActorConsequenceSchema = z.object({
    type: z.literal('removeActor'),
    actorId: z.string(),
    narrative: NarrativeSchema.optional(),
})

export const ChangeStatusConsequenceSchema = z.object({
    type: z.literal('changeStatus'),
    targetId: z.string(),
    targetType: z.enum(['actor', 'item', 'hotspot']),
    status: z.string(),
    narrative: NarrativeSchema.optional(),
})

export const SequenceConsequenceSchema = z.object({
    type: z.literal('sequence'),
    sequence: z.string(),
    narrative: NarrativeSchema.optional(),
})

export const ConversationConsequenceSchema = z.object({
    type: z.literal('conversation'),
    conversationId: z.string(),
    end: z.optional(z.boolean()),
    narrative: NarrativeSchema.optional(),
})

export const TeleportActorConsequenceSchema = z.object({
    type: z.literal('teleportActor'),
    actorId: z.string(),
    roomId: z.optional(z.string()),
    x: z.number(),
    y: z.number(),
    narrative: NarrativeSchema.optional(),
})

export const ToggleZoneConsequenceSchema = z.object({
    type: z.literal('toggleZone'),
    roomId: z.optional(z.string()),
    on: z.boolean(),
    ref: z.string(),
    zoneType: z.enum(['hotspot', 'obstacle', 'walkable']),
    narrative: NarrativeSchema.optional(),
})


export const SoundEffectConsequenceSchema = z.object({
    type: z.literal('soundEffect'),
    sound: z.string(),
    volume: z.number().optional(),
    narrative: NarrativeSchema.optional(),
})

export const BackgroundMusicConsequenceSchema = z.object({
    type: z.literal('backgroundMusic'),
    sound: z.string().optional(),
    roomId: z.string().optional(),
    volume: z.number().optional(),
    narrative: NarrativeSchema.optional(),
})

export const AmbientNoiseConsequenceSchema = z.object({
    type: z.literal('ambientNoise'),
    sound: z.string().optional(),
    roomId: z.string().optional(),
    volume: z.number().optional(),
    narrative: NarrativeSchema.optional(),
})

export const FlagConsequenceSchema = z.object({
    type: z.literal('flag'),
    on: z.boolean(),
    flag: z.string(),
    narrative: NarrativeSchema.optional(),
})

export const ConversationChoiceConsequenceSchema = z.object({
    type: z.literal('conversationChoice'),
    on: z.boolean(),
    conversationId: z.string(),
    branchId: z.string(),
    choiceRef: z.string(),
    narrative: NarrativeSchema.optional(),
})

export const StoryBoardConsequenceSchema = z.object({
    type: z.literal('storyBoardConsequence'),
    storyBoardId: z.string(),
    narrative: NarrativeSchema.optional(),
})