import { z } from "zod"
import { InteractionSchema } from "./Interaction"
import { ItemData, ItemDataSchema } from "./ItemData"
import { orderSchema } from "./Order"
import { RoomData, RoomDataSchema } from "./RoomData"
import { SequenceSchema } from "./Sequence"
import { CharacterData, CharacterDataSchema } from "./CharacterData"
import { VerbSchema } from "./Verb"
import { Conversation, ConversationSchema } from "./Conversation"
import { SpriteData, SpriteSheet, SpriteDataSchema, SpriteSheetSchema } from "./SpriteSheet"


const GameHappeningsSchema = z.object({
    sequenceRunning: SequenceSchema.optional(),
    characterOrders: z.record(z.string(), orderSchema.array()),
})

const GameContentsDataSchema =  z.object({
    rooms: RoomDataSchema.array(),
    items: ItemDataSchema.array(),
    characters: CharacterDataSchema.array(),
    interactions: InteractionSchema.array(),
    conversations: ConversationSchema.array(),
    characterOrders: z.record(z.string(), orderSchema.array()),
    currentRoomId: z.string(),
    id: z.string(),
})

export const FixedGameInfoSchema = z.object({
    verbs: VerbSchema.array(),
    sequences: z.record(z.string(), SequenceSchema),
    sprites: SpriteDataSchema.array(),
    spriteSheets: SpriteSheetSchema.array(),
})
export const GameDataSchema = GameContentsDataSchema.and(GameHappeningsSchema)
const GameConditionSchema = GameContentsDataSchema.and(GameHappeningsSchema).and(FixedGameInfoSchema)
export const GameDesignSchema = GameContentsDataSchema.and(FixedGameInfoSchema)


export type GameData = z.infer<typeof GameDataSchema>
export type FixedGameInfo = z.infer<typeof FixedGameInfoSchema>
export type GameCondition = z.infer<typeof GameConditionSchema>
export type GameDesign = z.infer<typeof GameDataSchema>

export type GameDataItem = CharacterData | ItemData | Conversation | RoomData | SpriteData | SpriteSheet
