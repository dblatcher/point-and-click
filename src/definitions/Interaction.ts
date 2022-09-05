import { z } from "zod"
import { ConsequenceSchema } from "./Consequence"
import { Order, orderSchema } from "./Order"


export const InteractionSchema = z.object({
    verbId: z.string(),
    targetId: z.string(),
    roomId: z.string().optional(),
    itemId: z.string().optional(),
    targetStatus: z.string().optional(),
    mustReachFirst: z.boolean().optional(),
    consequences: z.array(ConsequenceSchema),
})

export type Interaction = z.infer<typeof InteractionSchema>