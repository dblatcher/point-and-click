import { z } from "zod"
import { ImmediateConsequenceSchema } from "./Interaction"
import { orderSchema } from "./Order"

export const StageSchema = z.object({
    characterOrders: z.optional(
        z.record(z.string(), orderSchema.array())
    ),
    immediateConsequences: z.optional(ImmediateConsequenceSchema.array())
})
export type Stage = z.infer<typeof StageSchema>

export const SequenceSchema = z.object({
    description: z.string().optional(),
    stages: StageSchema.array(),
})
export type Sequence = z.infer<typeof SequenceSchema>
