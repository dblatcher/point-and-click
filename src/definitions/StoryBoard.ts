import { z } from "zod";

const xPlacement = z.enum(['center', 'left', 'right'])
const yPlacement = z.enum(['center', 'top', 'bottom'])

const TextPagePartSchema = z.object({
    type: z.literal('text'),
    text: z.string(),
    x: xPlacement,
    y: yPlacement,
});
const ImagePagePartSchema = z.object({
    type: z.literal('image'),
    imageAssetId: z.string(),
    x: xPlacement,
    y: yPlacement,
});

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