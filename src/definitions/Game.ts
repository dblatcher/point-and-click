import { z } from "zod"
import { InteractionSchema } from "./Interaction"
import { ItemData, ItemDataSchema } from "./ItemData"
import { orderSchema } from "./Order"
import { RoomData, RoomDataSchema } from "./RoomData"
import { Sequence, SequenceSchema } from "./Sequence"
import { ActorData, ActorDataSchema } from "./ActorData"
import { Verb, VerbSchema } from "./Verb"
import { Conversation, ConversationSchema } from "./Conversation"
import { SpriteData, SpriteDataSchema } from "./SpriteSheet"
import { Ending, EndingSchema } from "./Ending"
import { FlagMapSchema } from "./Flag"


const GameHappeningsSchema = z.object({
    sequenceRunning: SequenceSchema.optional(),
    actorOrders: z.record(z.string(), orderSchema.array()),
    currentConversationId: z.string().optional(),
    endingId: z.string().optional(),
    pendingInteraction: InteractionSchema.optional(),
    gameNotBegun: z.boolean(),
})

const GameContentsDataSchema = z.object({
    rooms: RoomDataSchema.array(),
    items: ItemDataSchema.array(),
    actors: ActorDataSchema.array(),
    interactions: InteractionSchema.array(),
    conversations: ConversationSchema.array(),
    flagMap: FlagMapSchema,
    currentRoomId: z.string(),
    id: z.string(),
})


export const FixedGameInfoSchema = z.object({
    verbs: VerbSchema.array(),
    sequences: SequenceSchema.array(),
    sprites: SpriteDataSchema.array(),
    endings: EndingSchema.array(),
    openingSequenceId: z.string().optional(),
})
export const GameDataSchema = GameContentsDataSchema.and(GameHappeningsSchema)
const GameConditionSchema = GameContentsDataSchema.and(GameHappeningsSchema).and(FixedGameInfoSchema)
export const GameDesignSchema = GameContentsDataSchema.and(FixedGameInfoSchema)

//                  GameData GameCondition GameDesign GameContents
// GameHappenings  |   x    |   x        |           |
// GameContentsData|   x    |   x        |  x        |  x
// FixedGameInfo   |        |   x        |  x        |

export type GameContents = z.infer<typeof GameContentsDataSchema>
export type GameData = z.infer<typeof GameDataSchema>
export type FixedGameInfo = z.infer<typeof FixedGameInfoSchema>
export type GameCondition = z.infer<typeof GameConditionSchema>
export type GameDesign = z.infer<typeof GameDesignSchema>

export type GameDataItem = ActorData | ItemData | Conversation | RoomData | SpriteData | Sequence | Ending | Verb
