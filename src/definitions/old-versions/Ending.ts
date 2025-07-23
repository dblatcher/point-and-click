import { number, object, string, z } from "zod"

export const EndingSchema = object({
    id: string(),
    message: string(),
    imageId: string().optional(),
    imageWidth: number().optional(),
})

export type Ending = z.infer <typeof EndingSchema>
