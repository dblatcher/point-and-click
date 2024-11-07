import { z } from "zod"
import { HotspotZoneSchema, ZoneSchema } from "./Zone"
import { NarrativeSchema } from "./BaseTypes"

const BackgroundLayerSchema = z.object({
    parallax: z.number(),
    imageId: z.string(),
})
export type BackgroundLayer = z.infer<typeof BackgroundLayerSchema>

const ScaleLevelSchema = z.array(z.tuple([z.number(), z.number()]))
export type ScaleLevel = z.infer<typeof ScaleLevelSchema>

const ambientSoundSchema = z.object({
    soundId: z.string(),
    volume: z.number().optional(),
})
export type AmbientSound = z.infer<typeof ambientSoundSchema>

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
    backgroundMusic: ambientSoundSchema.optional(),
    ambientNoise: ambientSoundSchema.optional(),
})
export type RoomData = z.infer<typeof RoomDataSchema>
