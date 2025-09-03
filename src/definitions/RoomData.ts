import { z } from "zod"
import { HotspotZoneSchema, ZoneSchema } from "./Zone"
import { soundInstanceSchema, NarrativeSchema } from "./BaseTypes"

const BackgroundLayerSchema = z.object({
    parallax: z.number(),
    imageId: z.string(),
    placement: z.object({
        x: z.number(),
        y: z.number(),
        width: z.number(),
        height: z.number(),
    }).optional(),
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
    backgroundColor: z.string().optional(),
    name: z.string().optional(),
    narrative: NarrativeSchema.optional(),
    backgroundMusic: soundInstanceSchema.optional(),
    ambientNoise: soundInstanceSchema.optional(),
})
export type RoomData = z.infer<typeof RoomDataSchema>
