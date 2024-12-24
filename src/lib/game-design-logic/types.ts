import { GameDesign, Interaction } from "@/definitions";
import { GameDataItem, GameDataItemType } from "@/definitions/Game";
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

type CreateDataItemAction = {
    type: 'create-data-item',
    property: GameDataItemType,
    data: GameDataItem,
}

type DeleteDataItemAction = {
    type: 'delete-data-item',
    property: GameDataItemType,
    index: number,
}

type ChangeOrAddInteractionAction = {
    type: 'change-or-add-interaction',
    data: Interaction,
    index?: number
}

type DeleteInteractionAction = {
    type: 'delete-interaction',
    index: number
}

export type GameDesignAction =
    OpenInEditorAction |
    ModifyDesignAction |
    UndoAction |
    LoadNewAction |
    CreateDataItemAction |
    DeleteDataItemAction |
    ChangeOrAddInteractionAction |
    DeleteInteractionAction;

export type GameEditorState = {
    gameDesign: GameDesign;
    history: { gameDesign: GameDesign; label: string }[];
    tabOpen: TabId;
    gameItemIds: Partial<Record<GameDataItemType, string>>;
}
