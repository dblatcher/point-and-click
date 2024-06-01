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
    })),
    _started: z.oboolean(),
})
export type MoveOrder = z.infer<typeof MoveOrderSchema>

export const GotoOrderSchema = z.object({
    type: z.literal('goTo'),
    animation: z.optional(z.string()),
    speed: z.optional(z.number()),
    targetId: z.string(),
    _started: z.oboolean(),
})
export type GotoOrder = z.infer<typeof GotoOrderSchema>

export const SayOrderSchema = z.object({
    type: z.literal('say'),
    animation: z.optional(z.string()),
    text: z.string(),
    time: z.number(),
    _started: z.oboolean(),
})
export type SayOrder = z.infer<typeof SayOrderSchema>

export const ActOrderSchema = z.object({
    type: z.literal('act'),
    steps: z.array(z.object({
        animation: z.optional(z.string()),
        duration: z.number(),
        timeElapsed: z.optional(z.number()),
        reverse: z.optional(z.boolean()),
    })),
    _started: z.oboolean(),
})
export type ActOrder = z.infer<typeof ActOrderSchema>

export const orderSchema = z.union([MoveOrderSchema, ActOrderSchema, SayOrderSchema, GotoOrderSchema])
export type Order = z.infer<typeof orderSchema>
export type OrderType = 'move' | 'act' | 'say' | 'goTo'
export const orderTypes: OrderType[] = orderSchema.options.map(option => option.shape.type.value)

export const stepSchama = {
    act: ActOrderSchema.shape.steps.element,
    move: MoveOrderSchema.shape.steps.element,
}

export type ActStep = z.infer<typeof stepSchama.act>
export type MoveStep = z.infer<typeof stepSchama.move>