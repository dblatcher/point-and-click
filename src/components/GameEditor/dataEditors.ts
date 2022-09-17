import { GameDataItem } from "src";
import { EditorOptions } from ".";

export type DataItemEditorProps<ItemType extends GameDataItem> = {
    data?: ItemType;
    updateData: { (data: ItemType): void };
    deleteData: { (index: number): void };
    options: EditorOptions;
}

export const icons = {
    UP: '🔼',
    DOWN: '🔽',
    INSERT: '➕',
    DELETE: '❌',
}
