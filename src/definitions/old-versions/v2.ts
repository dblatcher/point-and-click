import { z } from "zod"
import { ActorDataSchema } from "../ActorData"
import { ConversationSchema } from "../Conversation"
import { EndingSchema } from "./Ending"
import { FlagMapSchema } from "../Flag"
import { InteractionSchema } from "../Interaction"
import { ItemDataSchema } from "../ItemData"
import { RoomDataSchema } from "../RoomData"
import { SequenceSchema } from "../Sequence"
import { SpriteDataSchema } from "../SpriteSheet"
import { StoryBoardSchema } from "../StoryBoard"
import { VerbSchema } from "../Verb"
import { GameHappeningsSchema } from "../Game"

const GameContentsDataSchema = z.object({
    schemaVersion: z.undefined(),
    rooms: RoomDataSchema.array(),
    items: ItemDataSchema.array(),
    actors: ActorDataSchema.array(),
    interactions: InteractionSchema.array(),
    conversations: ConversationSchema.array(),
    flagMap: FlagMapSchema,
    currentRoomId: z.string(),
    id: z.string(),
    description: z.string().optional().describe('a short description of your game'),
})


const FixedGameInfoSchema = z.object({
    verbs: VerbSchema.array(),
    sequences: SequenceSchema.array(),
    sprites: SpriteDataSchema.array(),
    endings: EndingSchema.array(),
    openingSequenceId: z.string().optional(),
    openingStoryboardId: z.string().optional(),
    storyBoards: StoryBoardSchema.array().optional(),
})

export const v2GameDataSchema = GameContentsDataSchema.and(GameHappeningsSchema)


export const v2GameDesignSchema = GameContentsDataSchema.and(FixedGameInfoSchema).describe('The game schema')
export type V2GameDesign = z.infer<typeof v2GameDesignSchema>
