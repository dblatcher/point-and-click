import { z } from "zod"

export const MoveOrderSchema = z.object({
    type: z.literal('move'),
    pathIsSet: z.optional(z.boolean()),
    doPendingInteractionWhenFinished: z.optional(z.boolean()),
    steps: z.array(z.object({
        animation: z.optional(z.string()),
        x: z.number(),
        y: z.number(),
        speed: z.optional(z.number()),
    }))
})
export type MoveOrder = z.infer<typeof MoveOrderSchema>

export const TalkOrderSchema = z.object({
    type: z.literal('talk'),
    steps: z.array(z.object({
        animation: z.optional(z.string()),
        text: z.string(),
        time: z.number(),
    }))
})
export type TalkOrder = z.infer<typeof TalkOrderSchema>

export const SayOrderSchema = z.object({
    type: z.literal('say'),
    animation: z.optional(z.string()),
    text: z.string(),
    time: z.number(),
})
export type SayOrder = z.infer<typeof SayOrderSchema>

export const ActOrderSchema = z.object({
    type: z.literal('act'),
    steps: z.array(z.object({
        animation: z.optional(z.string()),
        duration: z.number(),
        timeElapsed: z.optional(z.number()),
        reverse: z.optional(z.boolean()),
    }))
})
export type ActOrder = z.infer<typeof ActOrderSchema>

export const orderSchema = z.union([MoveOrderSchema, ActOrderSchema, TalkOrderSchema, SayOrderSchema])
export type Order = z.infer<typeof orderSchema>
export type OrderType = 'move' | 'talk' | 'act' | 'say'
export const orderTypes: OrderType[] = orderSchema.options.map(option => option.shape.type.value)

export const stepSchama = {
    talk: TalkOrderSchema.shape.steps.element,
    act: ActOrderSchema.shape.steps.element,
    move: MoveOrderSchema.shape.steps.element,
}

export type TalkStep = z.infer<typeof stepSchama.talk>
export type ActStep = z.infer<typeof stepSchama.act>
export type MoveStep = z.infer<typeof stepSchama.move>