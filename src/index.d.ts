

export type Point = { x: number; y: number }

export type { GameData, GameCondition, GameDataItem, GameDesign } from "./definitions/Game";
export type { ItemData } from "./definitions/ItemData"
export type { CommandTarget, Command } from "./definitions/Command";
export type { Verb } from "./definitions/Verb";
export type { RoomData, BackgroundLayer, ScaleLevel } from "./definitions/RoomData"
export type { Order, MoveOrder, TalkOrder, ActOrder, OrderType } from "./definitions/Order";
export type { ActorData, SoundValue } from "./definitions/ActorData";
export type { Direction } from "./definitions/SpriteSheet";
export type { Zone, HotspotZone, SupportedZoneShape, Shape } from "./definitions/Zone"
export type { Conversation, ConversationChoice, ConversationBranch } from "./definitions/Conversation"
export type { Consequence, ConsequenceType, AnyConsequence, ZoneType, ImmediateConsequence, OrderConsequence } from "./definitions/Consequence"
export type { Interaction } from "./definitions/Interaction"
export { zoneTypes } from "./definitions/Interaction"
export type { Sequence } from "./definitions/Sequence";
export type { SpriteSheet, SpriteData, SpriteFrame, } from "./definitions/SpriteSheet";
export type { Ending } from "./definitions/Ending"

export type { Direction, Ident, SpriteParams, Position } from "./definitions/BaseTypes"

export type Stage = { actorOrders?: Record<string, Order[]>; immediateConsequences?: ImmediateConsequence[] }