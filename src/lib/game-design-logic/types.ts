import { GameDesign } from "@/definitions";
import { GameDataItemType } from "@/definitions/Game";
import { TabId } from "../editor-config";


export type GameEditorProps = {
    usePrebuiltGame?: boolean;
}

export type GameDesignAction = {
    type: string
}

export type GameEditorState = {
    gameDesign: GameDesign;
    history: { gameDesign: GameDesign; label: string }[];
    tabOpen: TabId;
    gameItemIds: Partial<Record<GameDataItemType, string>>;
}
