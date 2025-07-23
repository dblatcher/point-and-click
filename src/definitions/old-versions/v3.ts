import { z } from "zod"
import { EndingSchema } from "./deprecated-schemas"
import { FixedGameInfoSchema, GameContentsDataSchema, GameHappeningsSchema } from "../Game"
import { StoryBoardSchema } from "../StoryBoard"



const v3GameHappeningsSchema = GameHappeningsSchema.merge(z.object({
    endingId: z.string().optional(),
}))

const v3GameContentsDataSchema = GameContentsDataSchema.merge(z.object({
    schemaVersion: z.literal(3),
}))


const v3FixedGameInfoSchema = FixedGameInfoSchema.merge(z.object({
    endings: EndingSchema.array(),
    storyBoards: StoryBoardSchema.array(),
}))

export const v3GameDataSchema = v3GameContentsDataSchema.and(v3GameHappeningsSchema)


export const v3GameDesignSchema = v3GameContentsDataSchema.and(v3FixedGameInfoSchema).describe('The game schema')
export type V3GameDesign = z.infer<typeof v3GameDesignSchema>