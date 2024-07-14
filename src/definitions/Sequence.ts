import { z } from "zod"
import { ImmediateConsequenceSchema } from "./Consequence"
import { orderSchema } from "./Order"
import { NarrativeSchema } from "./BaseTypes"

export const StageSchema = z.object({
    actorOrders: z.optional(
        z.record(z.string(), orderSchema.array())
    ),
    immediateConsequences: z.optional(ImmediateConsequenceSchema.array()),
    narrative: NarrativeSchema,
})
export type Stage = z.infer<typeof StageSchema>

export const SequenceSchema = z.object({
    id: z.string(),
    description: z.string().optional(),
    stages: StageSchema.array(),
})
export type Sequence = z.infer<typeof SequenceSchema>
