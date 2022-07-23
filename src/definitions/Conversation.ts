import { z } from "zod"

const ConversationChoiceSchema = z.object({
    ref: z.optional(z.string()),
    text: z.string(),
    sequence: z.string(),
    nextBranch: z.optional(z.string()),
    once: z.optional(z.boolean()),
    disabled: z.optional(z.boolean()),
    enablesChoices: z.optional(z.array(z.array(z.optional(z.string())))),
    disablesChoices: z.optional(z.array(z.array(z.optional(z.string())))),
    end: z.optional(z.boolean()),
})

export type ConversationChoice = z.infer <typeof ConversationChoiceSchema>

const ConversationBranchSchema = z.object({
    choices: z.array(ConversationChoiceSchema)
})

export type ConversationBranch = z.infer<typeof ConversationBranchSchema>

export const ConversationSchema = z.object({
    id: z.string(),
    branches: z.record(z.string(), z.optional(ConversationBranchSchema)),
    currentBranch: z.optional(z.string()),
    defaultBranch: z.string(),
})

export type Conversation = z.infer<typeof ConversationSchema>