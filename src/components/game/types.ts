import { ActorData, CommandTarget, GameDesign, Order } from "point-click-lib";
import { Sprite } from "@/lib/Sprite";
import { SoundService } from "@/services/soundService";
import { UiComponentSet } from "./uiComponentSet";


export type GameProps = Readonly<{
    _sprites: Sprite[];
    showDebugLog?: boolean;
    startPaused?: boolean;
    uiComponents?: UiComponentSet;
    instantMode?: boolean;
    soundService: SoundService;
    timerInterval?: number;
    orderSpeed?: number;
    allowLocalSaves?: boolean;
} & GameDesign>

export type HandleHoverFunction = { (target: CommandTarget, event: 'enter' | 'leave'): void };
export type HandleClickFunction<T extends CommandTarget> = { (target: T, event: PointerEvent): void };
export type ActorWithOrdersAndClickHandlers = {
    data: ActorData;
    orders?: Order[];
    clickHandler?: HandleClickFunction<ActorData>;
    contextClickHandler?: HandleClickFunction<ActorData>;
    overrideSprite?: Sprite;
}
