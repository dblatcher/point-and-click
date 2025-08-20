import { z } from "zod"
import { IdentSchema, StaticFrameParamsSchema } from "./BaseTypes"


export const ItemDataSchema = IdentSchema.extend({
    type: z.literal('item'),
    actorId: z.string().optional(),
}).and(StaticFrameParamsSchema.partial())

export type ItemData = z.infer<typeof ItemDataSchema>
