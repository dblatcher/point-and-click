import { z } from "zod";
import { StaticFrameParamsSchema } from "./BaseTypes";

const xPlacement = z.enum(['center', 'left', 'right'])
const yPlacement = z.enum(['center', 'top', 'bottom'])

const sizing = z.object({
    x: xPlacement,
    y: yPlacement,
    width: z.number().optional(),
    height: z.number().optional(),
})

const TextPagePartSchema = sizing.merge(z.object({
    type: z.literal('text'),
    text: z.string().array(),
}));
const ImagePagePartSchema = sizing.merge(z.object({
    type: z.literal('image'),
    image: StaticFrameParamsSchema,
}));

const PagePartSchema = z.union([TextPagePartSchema, ImagePagePartSchema])
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