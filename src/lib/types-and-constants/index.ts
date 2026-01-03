import { Consequence, Command, Order, ActorData, Stage } from "point-click-lib";

export const DEFAULT_TALK_TIME = 200;
export const CELL_SIZE = 5
export type XY = { x: number, y: number };

export interface InGameEventReporter {
    reportConsequence: (consequence: Consequence, success: boolean, offscreen: boolean) => void;
    reportCommand: (command: Command) => void;
    reportOrder: (order: Order, actor: ActorData) => void;
    reportStage: (stage: Stage) => void;
    reportCurrentConversation: () => void;
}

export interface PlaySound { (soundId: string, volume?: number): boolean }

export type GameRuntimeOptions = {
    instantMode?: boolean;
    orderSpeed?: number;
    playSound: PlaySound;
    // cellSize: number; TO DO - make this a prop? Or maybe an attribute of a gamedesign? or RoomData?
}