import { z } from "zod"
import { IdentSchema } from "./BaseTypes"

export const ItemDataSchema = IdentSchema.extend({
    type: z.literal('item'),
    characterId: z.optional(z.string()),
    imageId: z.optional(z.string()),
})

export type ItemData = z.infer<typeof ItemDataSchema>
