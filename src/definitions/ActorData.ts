import { z } from "zod";
import { IdentSchema, PositionSchema, SpriteParamsSchema, StaticFrameParamsSchema } from "./BaseTypes"

export const SoundValueSchema = z.object({
    soundId: z.string(),
    frameIndex: z.number().optional(),
    volume: z.number().optional(),
})
export type SoundValue = z.infer<typeof SoundValueSchema>;

const SoundEffectMapSchema = z.record(z.string(), SoundValueSchema.or(z.undefined()));
export type SoundEffectMap = z.infer<typeof SoundEffectMapSchema>;

export const ActorDataSchema = IdentSchema
    .merge(PositionSchema)
    .merge(SpriteParamsSchema)
    .merge(z.object({
        type: z.literal('actor'),
        isPlayer: z.optional(z.boolean()),
        noInteraction: z.optional(z.boolean()),
        speed: z.optional(z.number()),
        baseline: z.optional(z.number()),
        dialogueColor: z.optional(z.string()),
        soundEffectMap: SoundEffectMapSchema.optional(),
        walkToX: z.number().optional(),
        walkToY: z.number().optional(),
        defaultFrame: StaticFrameParamsSchema.optional(),
    }))

export type ActorData = z.infer<typeof ActorDataSchema>
