import { z } from "zod"

export const VerbSchema = z.object({
    id: z.string(),
    label: z.string(),
    preposition: z.optional(z.string()),
})

export type Verb = z.infer<typeof VerbSchema>

