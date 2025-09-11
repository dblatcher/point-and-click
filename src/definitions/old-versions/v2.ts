import { z } from "zod"
import { ActorDataSchema } from "../ActorData"
import { FlagMapSchema } from "../Flag"
import { ItemDataSchema } from "../ItemData"
import { RoomDataSchema } from "../RoomData"
import { SpriteDataSchema } from "../SpriteSheet"
import { StoryBoardSchema } from "../StoryBoard"
import { VerbSchema } from "../Verb"
import { ConversationSchemaWithDeprecatedConsequences, EndingSchema, InteractionSchemaWithDeprecatedConsequences, SequenceSchemaWithDeprecatedConsequences } from "./deprecated-schemas"

const GameContentsDataSchema = z.object({
    schemaVersion: z.number().optional(),
    rooms: RoomDataSchema.array(),
    items: ItemDataSchema.array(),
    actors: ActorDataSchema.array(),
    interactions: InteractionSchemaWithDeprecatedConsequences.array(),
    conversations: ConversationSchemaWithDeprecatedConsequences.array(),
    flagMap: FlagMapSchema,
    currentRoomId: z.string(),
    id: z.string(),
    description: z.string().optional().describe('a short description of your game'),
    thumbnailAssetId: z.string().optional(),
})


const FixedGameInfoSchema = z.object({
    verbs: VerbSchema.array(),
    sequences: SequenceSchemaWithDeprecatedConsequences.array(),
    sprites: SpriteDataSchema.array(),
    endings: EndingSchema.array(),
    openingSequenceId: z.string().optional(),
    openingStoryboardId: z.string().optional(),
    storyBoards: StoryBoardSchema.array().optional(),
})



export const v2GameDesignSchema = GameContentsDataSchema.and(FixedGameInfoSchema).describe('The game schema')
export type V2GameDesign = z.infer<typeof v2GameDesignSchema>
