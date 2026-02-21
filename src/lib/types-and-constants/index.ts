import { ActorData, CommandTarget, Order } from "point-click-lib";

export const DEFAULT_TALK_TIME = 200;
export const CELL_SIZE = 5
export type XY = { x: number, y: number };


export type HandleClickFunction<T extends CommandTarget> = { (target: T, event: PointerEvent): void };
export type ActorWithOrdersAndClickHandlers = {
    data: ActorData;
    orders?: Order[];
    clickHandler?: HandleClickFunction<ActorData>;
    contextClickHandler?: HandleClickFunction<ActorData>;
}
