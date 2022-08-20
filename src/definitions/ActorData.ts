import {z} from "zod";
import { IdentSchema,PositionSchema,SpriteParamsSchema } from "./BaseTypes"

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
    }))

export type ActorData  = z.infer<typeof ActorDataSchema>
