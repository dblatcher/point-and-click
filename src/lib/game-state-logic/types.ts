import { GameData, CommandTarget } from "point-click-lib";
import { GameEventEmitter } from "../game-event-emitter";

export type GameState = GameData & {
    isPaused: boolean;
    timer?: number;
    currentVerbId: string;
    currentItemId?: string;
    hoverTarget?: CommandTarget;

    roomWidth: number;
    roomHeight: number;
    emitter: GameEventEmitter
}
