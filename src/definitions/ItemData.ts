import { z } from "zod"
import { IdentSchema } from "./BaseTypes"

export const ItemDataSchema = IdentSchema.extend({
    type: z.literal('item'),
    actorId: z.string().optional(),
    imageId: z.string().optional(),
    col: z.number().optional(),
    row: z.number().optional(),
})

export type ItemData = z.infer<typeof ItemDataSchema>
