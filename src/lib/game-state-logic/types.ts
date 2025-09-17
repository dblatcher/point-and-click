import { GameData, CommandTarget } from "@/definitions";
import { GameEventEmitter } from "../game-event-emitter";
import { CellMatrix } from "../pathfinding/cells";

export type GameState = GameData & {
    viewAngleX: number;
    isPaused: boolean;
    timer?: number;
    cellMatrix?: CellMatrix;
    currentVerbId: string;
    currentItemId?: string;
    hoverTarget?: CommandTarget;

    roomWidth: number;
    roomHeight: number;
    emitter: GameEventEmitter
}
