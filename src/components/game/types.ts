import { ActorData, CommandTarget, GameCondition, GameData, Order } from "@/definitions";
import { Sprite } from "@/lib/Sprite";
import { SoundService } from "@/services/soundService";
import { UiComponentSet } from "./uiComponentSet";


export type GameProps = Readonly<{
    save?: { (saveDate: GameData, fileName?: string): void };
    load?: { (fileName?: string): void };
    deleteSave?: { (fileName: string): void };
    listSavedGames?: { (): string[] };
    _sprites: Sprite[];
    showDebugLog?: boolean;
    startPaused?: boolean;
    uiComponents?: UiComponentSet;
    instantMode?: boolean;
    soundService: SoundService;
    timerInterval?: number;
    orderSpeed?: number;
} & GameCondition>

export type HandleHoverFunction = { (target: CommandTarget, event: 'enter' | 'leave'): void };
export type HandleClickFunction<T extends CommandTarget> = { (target: T, event: PointerEvent): void };
export type RoomContentItem = {
    data: ActorData;
    orders?: Order[];
    clickHandler?: HandleClickFunction<ActorData>;
    contextClickHandler?: HandleClickFunction<ActorData>;
    overrideSprite?: Sprite;
}
