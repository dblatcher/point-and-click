import { GameDataItem } from "src";

export type DataItemEditorProps<ItemType extends GameDataItem> = {
    data?: ItemType;
    updateData: { (data: ItemType): void };
    deleteData: { (index: number): void };
}

export const icons = {
    UP: '🔼',
    DOWN: '🔽',
    INSERT: '➕',
    DELETE: '❌',
}
