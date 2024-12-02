import { z } from "zod";
import { AspectRatioSchema, NarrativeSchema, StaticFrameParamsSchema } from "./BaseTypes";

export const xPlacement = z.enum(['center', 'left', 'right'])
export const yPlacement = z.enum(['center', 'top', 'bottom'])

const sizing = z.object({
    x: xPlacement,
    y: yPlacement,
    width: z.number().optional(),
    height: z.number().optional(),
    aspectRatio: AspectRatioSchema.optional(),
})

const PagePictureSchema = sizing.merge(z.object({
    image: StaticFrameParamsSchema,
}))
export type PagePicture = z.infer<typeof PagePictureSchema>

export const StoryBoardPageSchema = z.object({
    title: z.string(),
    narrative: NarrativeSchema,
    pictures: PagePictureSchema.array(),
    backgroundColor: z.string(),
    color: z.string(),
})

export type StoryBoardPage = z.infer<typeof StoryBoardPageSchema>;

export const StoryBoardSchema = z.object({
    id: z.string(),
    pages: StoryBoardPageSchema.array(),
})

export type StoryBoard = z.infer<typeof StoryBoardSchema>;