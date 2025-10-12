import { z } from "zod"
import { Narrative, NarrativeSchema } from "./BaseTypes"
import { AmbientNoiseConsequenceSchema, BackgroundMusicConsequenceSchema, ChangeRoomConsequenceSchema, ChangeStatusConsequenceSchema, ConversationChoiceConsequenceSchema, ConversationConsequenceSchema, FlagConsequenceSchema, InventoryConsequenceSchema, OrderConsequenceSchema, RemoveActorConsequenceSchema, SequenceConsequenceSchema, SoundEffectConsequenceSchema, StoryBoardConsequenceSchema, TeleportActorConsequenceSchema, ToggleZoneConsequenceSchema } from "./consequence-subtypes"
import { Order } from "./Order"

export type OrderConsequence = z.infer<typeof OrderConsequenceSchema>

export type ZoneType = z.infer<typeof ToggleZoneConsequenceSchema.shape.zoneType>
export const zoneTypes: ZoneType[] = ToggleZoneConsequenceSchema.shape.zoneType.options


export const ConsequenceSchema = z.union([
    OrderConsequenceSchema,
    ChangeRoomConsequenceSchema,
    InventoryConsequenceSchema,
    RemoveActorConsequenceSchema,
    ChangeStatusConsequenceSchema,
    SequenceConsequenceSchema,
    ConversationConsequenceSchema,
    TeleportActorConsequenceSchema,
    ToggleZoneConsequenceSchema,
    SoundEffectConsequenceSchema,
    BackgroundMusicConsequenceSchema,
    AmbientNoiseConsequenceSchema,
    FlagConsequenceSchema,
    ConversationChoiceConsequenceSchema,
    StoryBoardConsequenceSchema,
])

const ConsequenceTypeEnum = z.enum([
    'conversation', 'sequence', 'changeStatus', 'backgroundMusic', 'ambientNoise',
    'removeActor', 'inventory', 'changeRoom', 'order',
    'teleportActor', 'toggleZone', 'soundEffect', 'flag', 'conversationChoice', 'storyBoardConsequence'
])
export type ConsequenceType = z.infer<typeof ConsequenceTypeEnum>
export const consequenceTypes: ConsequenceType[] = ConsequenceTypeEnum.options

export const consequenceMap = {
    conversation: ConversationConsequenceSchema,
    sequence: SequenceConsequenceSchema,
    changeStatus: ChangeStatusConsequenceSchema,
    removeActor: RemoveActorConsequenceSchema,
    inventory: InventoryConsequenceSchema,
    changeRoom: ChangeRoomConsequenceSchema,
    order: OrderConsequenceSchema,
    teleportActor: TeleportActorConsequenceSchema,
    toggleZone: ToggleZoneConsequenceSchema,
    soundEffect: SoundEffectConsequenceSchema,
    flag: FlagConsequenceSchema,
    conversationChoice: ConversationChoiceConsequenceSchema,
    backgroundMusic: BackgroundMusicConsequenceSchema,
    ambientNoise: AmbientNoiseConsequenceSchema,
    storyBoardConsequence: StoryBoardConsequenceSchema,
} as const

export type Consequence = z.infer<typeof ConsequenceSchema>

const anyConsequenceSchema = z.object({
    type: ConsequenceTypeEnum,
})
    .extend(ConversationConsequenceSchema.partial().omit({ type: true }).shape)
    .extend(SequenceConsequenceSchema.partial().omit({ type: true }).shape)
    .extend(ChangeStatusConsequenceSchema.partial().omit({ type: true }).shape)
    .extend(RemoveActorConsequenceSchema.partial().omit({ type: true }).shape)
    .extend(InventoryConsequenceSchema.partial().omit({ type: true }).shape)
    .extend(ChangeRoomConsequenceSchema.partial().omit({ type: true }).shape)
    .extend(OrderConsequenceSchema.partial().omit({ type: true }).shape)
    .extend(TeleportActorConsequenceSchema.partial().omit({ type: true }).shape)
    .extend(ToggleZoneConsequenceSchema.partial().omit({ type: true }).shape)
    .extend(FlagConsequenceSchema.partial().omit({ type: true }).shape)
    .extend(ConversationChoiceConsequenceSchema.partial().omit({ type: true }).shape)
    .extend(BackgroundMusicConsequenceSchema.partial().omit({ type: true }).shape)
    .extend(AmbientNoiseConsequenceSchema.partial().omit({ type: true }).shape)
    .extend(StoryBoardConsequenceSchema.partial().omit({ type: true }).shape)

export type AnyConsequence = z.infer<typeof anyConsequenceSchema>


export const ImmediateConsequenceSchema = z.union([
    RemoveActorConsequenceSchema,
    ChangeStatusConsequenceSchema,
    InventoryConsequenceSchema,
    ConversationConsequenceSchema,
    TeleportActorConsequenceSchema,
    ToggleZoneConsequenceSchema,
    SoundEffectConsequenceSchema,
    FlagConsequenceSchema,
    ChangeRoomConsequenceSchema,
    ConversationChoiceConsequenceSchema,
    BackgroundMusicConsequenceSchema,
    AmbientNoiseConsequenceSchema,
    StoryBoardConsequenceSchema,
])
/**
 * The subset of consequences that are don't take multiple cycles
 * to happen - all of them except Orders and Sequences
 */
export type ImmediateConsequence = z.infer<typeof ImmediateConsequenceSchema>
export const immediateConsequenceTypes: ConsequenceType[] = ImmediateConsequenceSchema.options.map(member => member.shape.type.value)
