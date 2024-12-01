import { z } from "zod"

export const DirectionEnum = z.enum(['left', 'right', 'up', 'down'])
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
    sprite: z.string().optional(),
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

// TO DO - re-use in inventory Items schema?
export const StaticFrameParamsSchema = z.object({
    imageId: z.string(),
    col: z.number().optional(),
    row: z.number().optional(),
})
export type StaticFrameParamsS = z.infer<typeof StaticFrameParamsSchema>

export const NarrativeSchema = z.object({ text: z.string().array() });
export type Narrative = z.infer<typeof NarrativeSchema>;

export const AspectRatioSchema = z.object({ x: z.number(), y: z.number() })
export type AspectRatio = z.infer<typeof AspectRatioSchema>;