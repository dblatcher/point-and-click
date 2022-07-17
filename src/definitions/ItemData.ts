import { z } from "zod"
import { IdentSchema } from "./BaseTypes"

export const ItemSchema = IdentSchema.extend({
    type: z.literal('item'),
    characterId: z.optional(z.string()),
    imageId: z.optional(z.string()),
})

export type ItemData = z.infer<typeof ItemSchema>
