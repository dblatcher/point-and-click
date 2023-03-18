import { z } from "zod"
import { IdentSchema } from './BaseTypes'

const SupportedZoneShapeEnum = z.enum(['rect', 'circle', 'polygon'])
export type SupportedZoneShape = z.infer<typeof SupportedZoneShapeEnum>

const PolygonSchema = z.array(z.tuple([z.number(), z.number()]))
export type Polygon = z.infer<typeof PolygonSchema>

const ShapeSchema = z.object({
    type: z.string().optional(),
    x: z.number(),
    y: z.number(),
    path: z.optional(z.string()),
    polygon: z.optional(PolygonSchema),
    circle: z.optional(z.number()),
    rect: z.optional(z.tuple([z.number(), z.number()])),
})

export type Shape = z.infer<typeof ShapeSchema>

export const ZoneSchema = ShapeSchema
    .merge(z.object({
        ref: z.string().optional(),
        disabled: z.boolean().optional()
    }))

export type Zone = z.infer<typeof ZoneSchema>

export const HotspotZoneSchema = ShapeSchema
    .merge(IdentSchema)
    .merge(z.object({
        type: z.literal('hotspot'),
        parallax: z.number(),
        walkToX: z.number().optional(),
        walkToY: z.number().optional(),
    }))

export type HotspotZone = z.infer<typeof HotspotZoneSchema>
