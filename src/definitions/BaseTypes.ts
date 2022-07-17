import { z } from "zod"

export type Direction = 'left' | 'right'
export const directions: Direction[] = ['left', 'right']

export const IdentSchema = z.object({
    type: z.string(),
    id: z.string(),
    name: z.optional(z.string()),
    status: z.optional(z.string()),
})

export type Ident = z.infer<typeof IdentSchema>

export const SpriteParamsSchema = z.object({
    height: z.number(),
    width: z.number(),
    sprite: z.string(),
    direction: z.optional(z.enum(['left', 'right'])),
    filter: z.optional(z.string()),
})

export type SpriteParams = z.infer<typeof SpriteParamsSchema>

export const PositionSchema = z.object({
    room: z.optional(z.string()),
    x: z.number(),
    y: z.number(),
})

export type Position = z.infer<typeof PositionSchema>

