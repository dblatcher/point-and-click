import { z } from "zod"

const MoveOrderSchema = z.object({
    type: z.literal('move'),
    pathIsSet: z.optional(z.boolean()),
    steps: z.array(z.object({
        animation: z.optional(z.string()),
        x: z.number(),
        y: z.number(),
        speed: z.optional(z.number()),
    }))
})
export type MoveOrder = z.infer<typeof MoveOrderSchema>

const TalkOrderSchema = z.object({
    type: z.literal('talk'),
    steps: z.array(z.object({
        animation: z.optional(z.string()),
        text: z.string(),
        time: z.number(),
    }))
})
export type TalkOrder = z.infer<typeof TalkOrderSchema>

const ActOrderSchema = z.object({
    type: z.literal('act'),
    steps: z.array(z.object({
        animation: z.optional(z.string()),
        duration: z.string(),
        timeElapsed: z.optional(z.number()),
        reverse: z.optional(z.boolean()),
    }))
})
export type ActOrder = z.infer<typeof ActOrderSchema>

export const orderSchema = z.union([MoveOrderSchema, ActOrderSchema, TalkOrderSchema])
export type Order = MoveOrder | TalkOrder | ActOrder