import { z } from "zod"
import { ImmediateConsequenceSchema } from "./Consequence"
import { orderSchema } from "./Order"

export const StageSchema = z.object({
    actorOrders: z.optional(
        z.record(z.string(), orderSchema.array())
    ),
    immediateConsequences: z.optional(ImmediateConsequenceSchema.array())
})
export type Stage = z.infer<typeof StageSchema>

export const SequenceSchema = z.object({
    id: z.string(),
    description: z.string().optional(),
    stages: StageSchema.array(),
})
export type Sequence = z.infer<typeof SequenceSchema>
