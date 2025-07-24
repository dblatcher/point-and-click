import { number, object, string, z } from "zod"
import { NarrativeSchema } from "../BaseTypes"
import { OrderConsequenceSchema, ChangeRoomConsequenceSchema, InventoryConsequenceSchema, RemoveActorConsequenceSchema, ChangeStatusConsequenceSchema, SequenceConsequenceSchema, ConversationConsequenceSchema, TeleportActorConsequenceSchema, ToggleZoneConsequenceSchema, SoundEffectConsequenceSchema, BackgroundMusicConsequenceSchema, AmbientNoiseConsequenceSchema, FlagConsequenceSchema, ConversationChoiceConsequenceSchema, StoryBoardConsequenceSchema } from "../consequence-subtypes"
import { InteractionSchema } from "../Interaction"
import { SequenceSchema, StageSchema } from "../Sequence"
import { ConversationChoiceSchema, ConversationSchema } from "../Conversation"

/**
 * deprecated
 */
export const EndingSchema = object({
    id: string(),
    message: string(),
    imageId: string().optional(),
    imageWidth: number().optional(),
})

/**
 * deprecated
 */
export type Ending = z.infer<typeof EndingSchema>

/**
 * deprecated
 */
export const EndingConsequenceSchema = z.object({
    type: z.literal('ending'),
    endingId: z.string(),
    narrative: NarrativeSchema.optional(),
})


const ConsequenceSchemaWithDeprecated = z.union([
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

    EndingConsequenceSchema,
])
export type ConsequenceWithDeprecated = z.infer<typeof ConsequenceSchemaWithDeprecated>

export const ImmediateConsequenceSchemaWithDeprecated = z.union([
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

    EndingConsequenceSchema,
])

export const InteractionSchemaWithDeprecatedConsequences = InteractionSchema.merge(z.object({
    consequences: z.array(ConsequenceSchemaWithDeprecated),
}))

export const SequenceSchemaWithDeprecatedConsequences = SequenceSchema.merge(z.object({
    stages: StageSchema.merge(z.object({
        immediateConsequences: z.optional(ImmediateConsequenceSchemaWithDeprecated.array())
    })).array(),
}))
export type SequenceWithDeprecatedConsequences = z.infer<typeof SequenceSchemaWithDeprecatedConsequences>

const choiceSchemaWithDeprecated =  ConversationChoiceSchema.merge(z.object({
    choiceSequence: SequenceSchemaWithDeprecatedConsequences.optional()
}))
const branchSchemaWithDeprecated = z.object({
    choices: z.array(choiceSchemaWithDeprecated)
})

export const ConversationSchemaWithDeprecatedConsequences = ConversationSchema.merge(z.object({
    branches: z.record(z.string(), z.optional(branchSchemaWithDeprecated)),
}))
export type ConversationWithDeprecatedConsequences = z.infer<typeof ConversationSchemaWithDeprecatedConsequences>
