import { z } from "zod"
import { IdentSchema } from './BaseTypes'

const SupportedZoneShapeEnum = z.enum(['rect', 'circle', 'polygon'])
export type SupportedZoneShape = z.infer<typeof SupportedZoneShapeEnum>

const PolygonSchema = z.array(z.tuple([z.number(), z.number()]))
export type Polygon = z.infer<typeof PolygonSchema>

export const ZoneSchema = z.object({
    type: z.optional(z.string()),
    x: z.number(),
    y: z.number(),
    path: z.optional(z.string()),
    polygon: z.optional(PolygonSchema),
    circle: z.optional(z.number()),
    rect: z.optional(z.tuple([z.number(), z.number()])),
})

export type Zone = z.infer<typeof ZoneSchema>

export const HotspotZoneSchema = IdentSchema
    .merge(ZoneSchema)
    .merge(z.object({
        type: z.literal('hotspot'),
        parallax: z.number(),
    }))

export type HotspotZone = z.infer<typeof HotspotZoneSchema>
