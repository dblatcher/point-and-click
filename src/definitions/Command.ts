import { z } from "zod"
import { ActorDataSchema } from './ActorData'
import { ItemDataSchema } from './ItemData';
import { HotspotZoneSchema } from './Zone'
import { VerbSchema } from './Verb'

export const CommandTargetSchema = z.union([ActorDataSchema, ItemDataSchema, HotspotZoneSchema])
export type CommandTarget = z.infer<typeof CommandTargetSchema>

export const CommandSchema = z.object({
    verb: VerbSchema,
    target: CommandTargetSchema,
    item: z.optional(ItemDataSchema),
})

export type Command = z.infer<typeof CommandSchema>
