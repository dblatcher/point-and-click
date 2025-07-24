import { z } from "zod"
import { FixedGameInfoSchema, GameContentsDataSchema } from "../Game"
import { ConversationSchemaWithDeprecatedConsequences, EndingSchema, InteractionSchemaWithDeprecatedConsequences, SequenceSchemaWithDeprecatedConsequences } from "./deprecated-schemas"


const v3GameContentsDataSchema = GameContentsDataSchema.merge(z.object({
    schemaVersion: z.literal(3),
    interactions: InteractionSchemaWithDeprecatedConsequences.array(),
    conversations: ConversationSchemaWithDeprecatedConsequences.array(),
}))


const v3FixedGameInfoSchema = FixedGameInfoSchema.merge(z.object({
    endings: EndingSchema.array(),
    sequences: SequenceSchemaWithDeprecatedConsequences.array(),
}))



export const v3GameDesignSchema = v3GameContentsDataSchema.and(v3FixedGameInfoSchema).describe('The game schema')
export type V3GameDesign = z.infer<typeof v3GameDesignSchema>