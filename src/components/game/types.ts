import { ActorData, CommandTarget, Order } from "point-click-lib";

export type HandleClickFunction<T extends CommandTarget> = { (target: T, event: PointerEvent): void };
export type ActorWithOrdersAndClickHandlers = {
    data: ActorData;
    orders?: Order[];
    clickHandler?: HandleClickFunction<ActorData>;
    contextClickHandler?: HandleClickFunction<ActorData>;
}
