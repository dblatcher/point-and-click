import { Narrative } from "./BaseTypes";

export type Point = { x: number; y: number }

export type { GameData, GameCondition, GameDataItem, GameDesign, GameContents } from "./Game";
export type { ItemData } from "./ItemData"
export type { CommandTarget, Command } from "./Command";
export type { Verb } from "./Verb";
export type { RoomData, BackgroundLayer, ScaleLevel } from "./RoomData"
export type { Order, MoveOrder, ActOrder, OrderType, SayOrder, GotoOrder } from "./Order";
export type { ActorData, SoundValue } from "./ActorData";
export type { Direction } from "./SpriteSheet";
export type { Zone, HotspotZone, SupportedZoneShape, Shape } from "./Zone"
export type { Conversation, ConversationChoice, ConversationBranch } from "./Conversation"
export type { Consequence, ConsequenceType, AnyConsequence, ZoneType, ImmediateConsequence, OrderConsequence } from "./Consequence"
export type { Interaction } from "./Interaction"
export { zoneTypes } from "./Interaction"
export type { Sequence } from "./Sequence";
export type { SpriteData, SpriteFrame, Animation } from "./SpriteSheet";
export type { Ending } from "./Ending"
export type { FlagMap, Flag } from "./Flag"

export type { Direction, Ident, SpriteParams, Position } from "./BaseTypes"

export type Stage = { actorOrders?: Record<string, Order[]>; immediateConsequences?: ImmediateConsequence[]; narrative?: Narrative }