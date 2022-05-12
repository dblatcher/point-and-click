import { CellMatrix } from "../lib/pathfinding/cells"
import { Interaction } from "./Interaction"
import { ItemData } from "./ItemData"
import { Order, ThingOrder } from "./Order"
import { RoomData } from "./RoomData"
import { Sequence } from "./Sequence"
import { ThingData } from "./ThingData"
import { CharacterData } from "./CharacterData"
import { Verb } from "./Verb"

type GameContents = {
    rooms: RoomData[]
    things: ThingData[]
    characters: CharacterData[]
    interactions: Interaction[],
    items: ItemData[],
    currentRoomName: string
}

type GameHappenings = {
    characterOrders: Record<string, Order[]>
    thingOrders: Record<string, ThingOrder[]>
    sequenceRunning?: Sequence;
}

type GameData = GameContents & GameHappenings

type GameProps = Readonly<{
    verbs: Verb[],
    sequences: Record<string, Sequence>
    save?: { (saveDate: GameData): void }
    reset?:{ (): void }
    load?:{ (): void }
} & GameContents & Partial<GameHappenings>>

type GameState = GameData & {
    viewAngle: number
    isPaused: boolean
    timer?: number
    cellMatrix?: CellMatrix
    currentVerbId: string,
    currentItemId?: string,
}

export type { GameState, GameProps, GameData }