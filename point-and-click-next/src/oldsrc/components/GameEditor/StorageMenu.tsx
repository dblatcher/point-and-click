import { FunctionComponent } from "react";
import editorStyles from "./editorStyles.module.css"

import { downloadJsonFile, } from "../../lib/files";
import { DeleteButton } from "./formControls";
import { EditorOptions } from ".";

interface Props {
    type: string;
    data?: { id: string };
    originalId?: string;
    existingIds: string[];
    reset: { (): void };
    update: { (): void };
    saveButton?: boolean;
    load?: { (): void };
    deleteItem?: { (index: number): void };
    options: EditorOptions;
}

export const StorageMenu: FunctionComponent<Props> = ({
    type, data, originalId, existingIds, reset, update, saveButton, load, deleteItem, options
}: Props) => {
    const currentId = data?.id || '';

    const updateButtonText = originalId === currentId
        ? `Update ${originalId}`
        : existingIds.includes(currentId)
            ? `Overwrite ${currentId}`
            : `Add new ${type} ${currentId}`

    const indexOfOriginalId = originalId ? existingIds.indexOf(originalId) : -1
    const showDeleteButton =  originalId === currentId && indexOfOriginalId !== -1 && !!deleteItem
    const deleteButtonText = `Delete ${type} ${currentId}`

    const showUpdateButton = !options?.autoSave || !existingIds.includes(currentId)
    const showResetButton = data && !(options?.autoSave && originalId === currentId);

    return (
        <fieldset className={editorStyles.fieldset}>
            <legend>storage</legend>
            <div>
                {(saveButton && data) && <button onClick={(): void => { downloadJsonFile(data, type) }}>Save to file</button>}
                {load && <button onClick={load}>Load from file</button>}
            </div>
            <div>
                {showResetButton && <button onClick={reset}>Reset</button>}

                {showUpdateButton && <button onClick={update}>
                    {updateButtonText}
                </button>}
            </div>

            {showDeleteButton &&
                <DeleteButton label={deleteButtonText}
                    onClick={(): void => { deleteItem(indexOfOriginalId) }}
                />
            }
        </fieldset>
    )
}