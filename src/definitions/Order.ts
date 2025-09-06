import { z } from "zod"
import { DirectionEnum, NarrativeSchema } from "./BaseTypes"

const orderBase = {
    _started: z.oboolean(),
    narrative: NarrativeSchema.optional(),
    startDirection: DirectionEnum.optional(),
    endDirection: DirectionEnum.optional(),
    endStatus: z.string().optional(),
}

export const orderBaseOmits = {
    _started: true,
    narrative: true,
    startDirection: true,
    endDirection: true,
    endStatus: true,
    type: true,
} satisfies Record<string, true>

const moveStepSchema = z.object({
    animation: z.optional(z.string()),
    x: z.number(),
    y: z.number(),
    speed: z.optional(z.number()),
})
export type MoveStep = z.infer<typeof moveStepSchema>

export const MoveOrderSchema = z.object({
    type: z.literal('move'),
    roomId: z.string().optional(),
    pathIsSet: z.optional(z.boolean()),
    doPendingInteractionWhenFinished: z.optional(z.boolean()),
    steps: z.array(moveStepSchema),
}).extend(orderBase)
export type MoveOrder = z.infer<typeof MoveOrderSchema>

export const GotoOrderSchema = z.object({
    type: z.literal('goTo'),
    animation: z.optional(z.string()),
    speed: z.optional(z.number()),
    targetId: z.string(),
}).extend(orderBase)
export type GotoOrder = z.infer<typeof GotoOrderSchema>

export const SayOrderSchema = z.object({
    type: z.literal('say'),
    animation: z.optional(z.string()),
    text: z.string(),
    time: z.number(),
}).extend(orderBase)
export type SayOrder = z.infer<typeof SayOrderSchema>


const actStepSchema = z.object({
    animation: z.optional(z.string()),
    duration: z.number(),
    timeElapsed: z.optional(z.number()),
    reverse: z.optional(z.boolean()),
})
export type ActStep = z.infer<typeof actStepSchema>

export const ActOrderSchema = z.object({
    type: z.literal('act'),
    steps: z.array(actStepSchema),
}).extend(orderBase)
export type ActOrder = z.infer<typeof ActOrderSchema>

export const orderSchema = z.union([MoveOrderSchema, ActOrderSchema, SayOrderSchema, GotoOrderSchema])
export type Order = z.infer<typeof orderSchema>
export type OrderType = 'move' | 'act' | 'say' | 'goTo'
export const orderTypes: OrderType[] = orderSchema.options.map(option => option.shape.type.value)
