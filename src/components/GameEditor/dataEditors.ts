import { GameDataItem } from "src";

export type DataItemEditorProps<ItemType extends GameDataItem> = {
    data?: ItemType;
    updateData: { (data: ItemType): void };
    deleteData: { (index: number): void };
}
