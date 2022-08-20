

export type Point = { x: number; y: number }

export type { GameData, GameCondition, GameDataItem, GameDesign } from "./definitions/Game";
export type { ItemData } from "./definitions/ItemData"
export type { CommandTarget, Command } from "./definitions/Command";
export type { Verb } from "./definitions/Verb";
export type { RoomData, BackgroundLayer, ScaleLevel } from "./definitions/RoomData"
export type { Order, MoveOrder, TalkOrder, ActOrder } from "./definitions/Order";
export type { ActorData } from "./definitions/ActorData";
export type { Direction } from "./definitions/SpriteSheet";
export type { Zone, HotspotZone, SupportedZoneShape, Shape } from "./definitions/Zone"
export type { Conversation, ConversationChoice, ConversationBranch } from "./definitions/Conversation"
export type { Consequence, Interaction, ConsequenceType, AnyConsequence } from "./definitions/Interaction"
export type { Sequence } from "./definitions/Sequence";
export type { SpriteSheet, SpriteData, SpriteFrame, } from "./definitions/SpriteSheet";
export type { Ending } from "./definitions/Ending"

export type { Direction, Ident, SpriteParams, Position } from "./definitions/BaseTypes"

export type Stage = { actorOrders?: Record<string, Order[]>; immediateConsequences?: ImmediateConsequence[] }