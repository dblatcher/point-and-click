import { z } from "zod";
import { NarrativeSchema, StaticFrameParamsSchema } from "./BaseTypes";

const xPlacement = z.enum(['center', 'left', 'right'])
const yPlacement = z.enum(['center', 'top', 'bottom'])

const sizing = z.object({
    x: xPlacement,
    y: yPlacement,
    width: z.number().optional(),
    height: z.number().optional(),
})

const PagePartSchema = sizing.merge(z.object({
    narrative: NarrativeSchema.optional(),
    image: StaticFrameParamsSchema.optional(),
}))
export type PagePart = z.infer<typeof PagePartSchema>

export const StoryBoardPageSchema = z.object({
    title: z.string(),
    parts: PagePartSchema.array()
})

export type StoryBoardPage = z.infer<typeof StoryBoardPageSchema>;

export const StoryBoardSchema = z.object({
    id: z.string(),
    pages: StoryBoardPageSchema.array(),
})

export type StoryBoard = z.infer<typeof StoryBoardSchema>;