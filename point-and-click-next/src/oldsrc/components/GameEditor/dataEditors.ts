import type { Component } from "react";
import type { GameDataItem } from "src";
import type { EditorOptions } from ".";

export type DataItemEditorProps<ItemType extends GameDataItem> = {
    data?: ItemType;
    updateData: { (data: ItemType): void };
    deleteData: { (index: number): void };
    options: EditorOptions;
}

export type DataItemEditorComponent<
    T extends GameDataItem,
    P extends DataItemEditorProps<T>,
    S extends { id: string }
> = Component<P, S> & { currentData: T; existingIds: string[] };

export type EnhancedSetStateFunction<
    S extends { id: string }
> = { (input: Partial<S> | { (state: S): Partial<S> }, callback?: { (): void }): void }

//TO do - use this tp replace the SetStateWithAutosave functions defined in the rest of the editor component
export function higherLevelSetStateWithAutosave<
    T extends GameDataItem,
    P extends DataItemEditorProps<T>,
    S extends { id: string }
>(component: DataItemEditorComponent<T, P, S>): EnhancedSetStateFunction<S> {

    return (input, callback): void => {
        const { options, data, updateData, } = component.props

        if (!options.autoSave) {
            return component.setState(input, callback)
        }

        return component.setState(input, () => {
            const isExistingId = component.existingIds.includes(component.state.id)
            if (data && isExistingId) {
                updateData(component.currentData)
            }
            if (callback) {
                callback()
            }
        })
    }
}

export const icons = {
    UP: '🔼',
    DOWN: '🔽',
    INSERT: '➕',
    DELETE: '❌',
}
