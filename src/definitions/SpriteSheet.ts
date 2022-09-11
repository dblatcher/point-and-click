import { z } from "zod"
import { type Direction, directions, DirectionEnum } from "./BaseTypes"


export const SpriteSheetSchema = z.object({
    id: z.string(),
    imageId: z.string(),
    rows: z.number(),
    cols: z.number(),
    widthScale: z.number().optional(),
    heightScale: z.number().optional(),
})
export type SpriteSheet = z.infer<typeof SpriteSheetSchema>

export const SpriteFrameSchema = z.object({
    sheetId: z.string(),
    row: z.number(),
    col: z.number(),
})
export type SpriteFrame = z.infer<typeof SpriteFrameSchema>


const animationsSchema = z.object({
    left: SpriteFrameSchema.array().optional(),
    right: SpriteFrameSchema.array().optional(),
    up: SpriteFrameSchema.array().optional(),
    down: SpriteFrameSchema.array().optional(),
})

export type Animation =  Partial<Record<Direction, SpriteFrame[]>>

export const SpriteDataSchema = z.object({
    id: z.string(),
    defaultDirection: DirectionEnum,
    animations: z.record(z.string(), animationsSchema)
})
export type SpriteData = z.infer<typeof SpriteDataSchema>


// export interface SpriteData {
//     id: string;
//     defaultDirection: Direction;
//     animations: Record<string, Partial<Record<Direction, SpriteFrame[]>>>;
// }


export { Direction, directions }