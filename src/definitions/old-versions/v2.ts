import { z } from "zod"
import { ActorDataSchema, ActorData } from "../ActorData"
import { ConversationSchema, Conversation } from "../Conversation"
import { EndingSchema, Ending } from "../Ending"
import { FlagMapSchema } from "../Flag"
import { InteractionSchema } from "../Interaction"
import { ItemDataSchema, ItemData } from "../ItemData"
import { orderSchema } from "../Order"
import { RoomDataSchema, RoomData } from "../RoomData"
import { SequenceSchema, Sequence } from "../Sequence"
import { SpriteDataSchema, SpriteData } from "../SpriteSheet"
import { StoryBoardSchema, StoryBoard } from "../StoryBoard"
import { VerbSchema, Verb } from "../Verb"



const GameHappeningsSchema = z.object({
    sequenceRunning: SequenceSchema.optional(),
    currentStoryBoardId: z.string().optional(),
    actorOrders: z.record(z.string(), orderSchema.array()),
    currentConversationId: z.string().optional(),
    endingId: z.string().optional(),
    pendingInteraction: InteractionSchema.optional(),
    gameNotBegun: z.boolean(),
})

export const GameContentsDataSchema = z.object({
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


export const FixedGameInfoSchema = z.object({
    verbs: VerbSchema.array(),
    sequences: SequenceSchema.array(),
    sprites: SpriteDataSchema.array(),
    endings: EndingSchema.array(),
    openingSequenceId: z.string().optional(),
    openingStoryboardId: z.string().optional(),
    storyBoards: StoryBoardSchema.array().optional(),
})
export const GameDataSchema = GameContentsDataSchema.and(GameHappeningsSchema)
const GameConditionSchema = GameContentsDataSchema.and(GameHappeningsSchema).and(FixedGameInfoSchema)
export const v2GameDesignSchema = GameContentsDataSchema.and(FixedGameInfoSchema).describe('The game schema')

//                  GameData GameCondition GameDesign GameContents
// GameHappenings  |   x    |   x        |           |
// GameContentsData|   x    |   x        |  x        |  x
// FixedGameInfo   |        |   x        |  x        |

export type GameContents = z.infer<typeof GameContentsDataSchema>
export type GameData = z.infer<typeof GameDataSchema>
export type FixedGameInfo = z.infer<typeof FixedGameInfoSchema>
export type GameCondition = z.infer<typeof GameConditionSchema>
export type V2GameDesign = z.infer<typeof v2GameDesignSchema>

export type GameDataItem = ActorData | ItemData | Conversation | RoomData | SpriteData | Sequence | Ending | Verb| StoryBoard

export const GameDataItemTypeEnum = z.enum([
    'rooms', 'items', 'actors', 'conversations', 'sprites', 'sequences', 'endings', 'verbs', 'storyBoards'
])

export type GameDataItemType =
    'rooms'
    | 'items'
    | 'actors'
    | 'conversations'
    | 'sprites'
    | 'sequences'
    | 'endings'
    | 'verbs'
    | 'storyBoards'