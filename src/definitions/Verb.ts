import { z, string, boolean } from "zod"

export const VerbSchema = z.object({
    id: string(),
    label: string(),
    preposition: string().optional(),
    isMoveVerb: boolean().optional(),
    isNotForItems: boolean().optional(),
    defaultResponseNoItem: string().optional(),
    defaultResponseWithItem: string().optional(),
    defaultResponseCannotReach: string().optional(),
})

export type Verb = z.infer<typeof VerbSchema>

