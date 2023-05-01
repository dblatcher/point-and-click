import { z } from "zod"
import { HotspotZoneSchema, ZoneSchema } from "./Zone"

const BackgroundLayerSchema = z.object({
    parallax: z.number(),
    imageId: z.string(),
})
export type BackgroundLayer = z.infer<typeof BackgroundLayerSchema>

const ScaleLevelSchema = z.array(z.tuple([z.number(), z.number()]))
export type ScaleLevel = z.infer<typeof ScaleLevelSchema>

export const RoomDataSchema = z.object({
    id: z.string(),
    frameWidth: z.number(),
    width: z.number(),
    height: z.number(),
    background: BackgroundLayerSchema.array(),
    hotspots: HotspotZoneSchema.array().optional(),
    obstacleAreas: z.optional(ZoneSchema.array()),
    walkableAreas: z.optional(ZoneSchema.array()),
    scaling: z.optional(ScaleLevelSchema),
})
export type RoomData = z.infer<typeof RoomDataSchema>
