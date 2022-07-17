import {z} from "zod";
import { IdentSchema,PositionSchema,SpriteParamsSchema } from "./BaseTypes"

export const CharacterDataSchema = IdentSchema
    .merge(PositionSchema)
    .merge(SpriteParamsSchema)
    .merge(z.object({
        type: z.literal('character'),
        isPlayer: z.optional(z.boolean()),
        speed: z.optional(z.number()),
        dialogueColor: z.optional(z.string()),
    }))

export type CharacterData  = z.infer<typeof CharacterDataSchema>
