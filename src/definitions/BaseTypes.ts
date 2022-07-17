import { z } from "zod"

const DirectionEnum = z.enum(['left', 'right'])
export type Direction = z.infer<typeof DirectionEnum>
export const directions: Direction[] = DirectionEnum.options

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
    direction: z.optional(DirectionEnum),
    filter: z.optional(z.string()),
})

export type SpriteParams = z.infer<typeof SpriteParamsSchema>

export const PositionSchema = z.object({
    room: z.optional(z.string()),
    x: z.number(),
    y: z.number(),
})

export type Position = z.infer<typeof PositionSchema>

