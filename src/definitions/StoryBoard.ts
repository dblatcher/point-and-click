import { z } from "zod";

export const StoryBoardPageSchema = z.object({
    title: z.string()
})

export type StoryPageBoard = z.infer<typeof StoryBoardPageSchema>;

export const StoryBoardSchema = z.object({
    id: z.string(),
    pages: StoryBoardPageSchema.array(),
})

export type StoryBoard = z.infer<typeof StoryBoardSchema>;