import { z } from "zod"
import { NarrativeSchema } from "./BaseTypes"

const orderBase = {
    _started: z.oboolean(),
    narrative: NarrativeSchema.optional(),
}

const moveStepSchema = z.object({
    animation: z.optional(z.string()),
    x: z.number(),
    y: z.number(),
    speed: z.optional(z.number()),
})
export type MoveStep = z.infer<typeof moveStepSchema>

export const MoveOrderSchema = z.object({
    ...orderBase,
    type: z.literal('move'),
    roomId: z.string().optional(),
    pathIsSet: z.optional(z.boolean()),
    doPendingInteractionWhenFinished: z.optional(z.boolean()),
    steps: z.array(moveStepSchema),
})
export type MoveOrder = z.infer<typeof MoveOrderSchema>

export const GotoOrderSchema = z.object({
    ...orderBase,
    type: z.literal('goTo'),
    animation: z.optional(z.string()),
    speed: z.optional(z.number()),
    targetId: z.string(),
})
export type GotoOrder = z.infer<typeof GotoOrderSchema>

export const SayOrderSchema = z.object({
    ...orderBase,
    type: z.literal('say'),
    animation: z.optional(z.string()),
    text: z.string(),
    time: z.number(),
})
export type SayOrder = z.infer<typeof SayOrderSchema>


const actStepSchema = z.object({
    animation: z.optional(z.string()),
    duration: z.number(),
    timeElapsed: z.optional(z.number()),
    reverse: z.optional(z.boolean()),
})
export type ActStep = z.infer<typeof actStepSchema>

export const ActOrderSchema = z.object({
    ...orderBase,
    type: z.literal('act'),
    steps: z.array(actStepSchema),
})
export type ActOrder = z.infer<typeof ActOrderSchema>

export const orderSchema = z.union([MoveOrderSchema, ActOrderSchema, SayOrderSchema, GotoOrderSchema])
export type Order = z.infer<typeof orderSchema>
export type OrderType = 'move' | 'act' | 'say' | 'goTo'
export const orderTypes: OrderType[] = orderSchema.options.map(option => option.shape.type.value)
