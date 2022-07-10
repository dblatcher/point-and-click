import { Point } from "../lib/pathfinding/geometry"

export interface MoveOrder {
    type: 'move';
    pathIsSet?: boolean;
    steps: (Point & { animation?: string; speed?: number })[];
}

interface DialogueLine {
    text: string;
    time: number;
    animation?: string;
}

export interface TalkOrder {
    type: 'talk';
    steps: DialogueLine[];
}

interface ActionStep {
    animation?: string;
    duration: number;
    timeElapsed?: number;
    reverse?: boolean;
}

export interface ActOrder {
    type: 'act';
    steps: ActionStep[];
}

export type Order = MoveOrder | TalkOrder | ActOrder