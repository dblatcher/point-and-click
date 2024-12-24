import { GameDesign } from "@/definitions";
import { GameDataItemType } from "@/definitions/Game";
import { TabId } from "../editor-config";


export type GameEditorProps = {
    usePrebuiltGame?: boolean;
}

type OpenInEditorAction = {
    type: 'open-in-editor';
    tabId: TabId;
    itemId?: string;
}

type ModifyDesignAction = {
    type: 'modify-design';
    description: string;
    mod: Partial<GameDesign>;
}

type UndoAction = {
    type: 'undo'
}

type LoadNewAction = {
    type: 'load-new',
    gameDesign: GameDesign,
}

export type GameDesignAction = OpenInEditorAction | ModifyDesignAction | UndoAction | LoadNewAction

export type GameEditorState = {
    gameDesign: GameDesign;
    history: { gameDesign: GameDesign; label: string }[];
    tabOpen: TabId;
    gameItemIds: Partial<Record<GameDataItemType, string>>;
}
