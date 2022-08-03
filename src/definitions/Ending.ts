import { object, string, z } from "zod"

export const EndingSchema = object({
    id: string(),
    message: string(),
    imageId: string().optional(),
})

export type Ending = z.infer <typeof EndingSchema>
