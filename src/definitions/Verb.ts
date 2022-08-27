import { z, string } from "zod"

export const VerbSchema = z.object({
    id: string(),
    label: string(),
    preposition: string().optional(),
    defaultResponseNoItem: string().optional(),
    defaultResponseWithItem: string().optional(),
    defaultResponseCannotReach: string().optional(),
})

export type Verb = z.infer<typeof VerbSchema>

