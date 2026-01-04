import { ActorData, CommandTarget, GameDesign, Order, GameRuntimeOptions } from "point-click-lib";
import { Sprite } from "@/lib/Sprite";
import { UiComponentSet } from "./uiComponentSet";


export type GameProps = Readonly<{
    showDebugLog?: boolean;
    startPaused?: boolean;
    uiComponents?: UiComponentSet;
    timerInterval?: number;
    allowLocalSaves?: boolean;
} & GameRuntimeOptions & GameDesign>

export type HandleHoverFunction = { (target: CommandTarget, event: 'enter' | 'leave'): void };
export type HandleClickFunction<T extends CommandTarget> = { (target: T, event: PointerEvent): void };
export type ActorWithOrdersAndClickHandlers = {
    data: ActorData;
    orders?: Order[];
    clickHandler?: HandleClickFunction<ActorData>;
    contextClickHandler?: HandleClickFunction<ActorData>;
    overrideSprite?: Sprite;
}
