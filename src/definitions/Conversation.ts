import { z } from "zod"
import { SequenceSchema } from "./Sequence";

const ChoiceRefSetSchema = z.object({
    conversationId: z.string().optional(),
    branchId: z.string().optional(),
    choiceRef: z.string().optional(),
})

export type ChoiceRefSet = z.infer<typeof ChoiceRefSetSchema>;

export const ConversationChoiceSchema = z.object({
    ref: z.string().optional(),
    text: z.string(),
    sequence: z.string().optional(),
    nextBranch: z.optional(z.string()),
    once: z.optional(z.boolean()),
    disabled: z.optional(z.boolean()),
    enablesChoices: z.array(ChoiceRefSetSchema).optional(),
    disablesChoices: z.array(ChoiceRefSetSchema).optional(),
    end: z.optional(z.boolean()),
    choiceSequence: SequenceSchema.optional(),
})

export type ConversationChoice = z.infer <typeof ConversationChoiceSchema>

export const ConversationBranchSchema = z.object({
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