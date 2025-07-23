import { number, object, string, z } from "zod"
import { NarrativeSchema } from "../BaseTypes"

export const EndingSchema = object({
    id: string(),
    message: string(),
    imageId: string().optional(),
    imageWidth: number().optional(),
})

export type Ending = z.infer <typeof EndingSchema>

/**
 * deprecated
 */
export const EndingConsequenceSchema = z.object({
    type: z.literal('ending'),
    endingId: z.string(),
    narrative: NarrativeSchema.optional(),
})
