import { z } from "zod"
import { ConsequenceSchema } from "./Consequence"


export const InteractionSchema = z.object({
    verbId: z.string(),
    targetId: z.string(),
    roomId: z.string().optional(),
    itemId: z.string().optional(),
    targetStatus: z.string().optional(),
    mustReachFirst: z.boolean().optional(),
    consequences: z.array(ConsequenceSchema),
    flagsThatMustBeFalse: z.array(z.string()).optional(),
    flagsThatMustBeTrue: z.array(z.string()).optional(),
    requiredInventory: z.array(z.string()).optional(),
})

export type Interaction = z.infer<typeof InteractionSchema>