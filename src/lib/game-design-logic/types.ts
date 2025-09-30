import { GameDesign, Interaction } from "@/definitions";
import { GameDataItem, GameDataItemType } from "@/definitions/Game";
import { TabId } from "../editor-config";
import { GameEditorDatabase } from "../indexed-db";

export type Tutorial = {
    title: string;
}

export type GameEditorProps = {
    usePrebuiltGame?: boolean;
    tutorial?: Tutorial;
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
type RedoAction = {
    type: 'redo'
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

type SetDBInstance = {
    type: 'set-db-instance',
    db: GameEditorDatabase,
}

type SetUpgradeInfo = {
    type: 'set-upgrade-info',
    data: DesignUpgradeInfo | undefined,
}

export type GameDesignAction =
    OpenInEditorAction |
    ModifyDesignAction |
    UndoAction |
    RedoAction |
    LoadNewAction |
    CreateDataItemAction |
    DeleteDataItemAction |
    ChangeOrAddInteractionAction |
    DeleteInteractionAction |
    SetDBInstance |
    SetUpgradeInfo;

export type DesignUpgradeInfo = {
    sourceIdentifier: string;
    sourceVersion: number;
}

export type GameEditorState = {
    gameDesign: GameDesign;
    history: { gameDesign: GameDesign; label: string }[];
    undoneHistory: { gameDesign: GameDesign; label: string }[];
    tabOpen: TabId;
    gameItemIds: Partial<Record<GameDataItemType, string>>;
    db?: GameEditorDatabase;
    upgradeInfo?: DesignUpgradeInfo;
}
