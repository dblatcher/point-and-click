import { FunctionComponent } from "react";
import { Button, ButtonGroup } from "@mui/material"
import { downloadJsonFile, } from "@/lib/files";
import { EditorOptions } from ".";
import { EditorBox } from "./EditorBox";
import { ButtonWithConfirm } from "./ButtonWithConfirm";


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
    const showDeleteButton = originalId === currentId && indexOfOriginalId !== -1 && !!deleteItem
    const deleteButtonText = `Delete ${type} ${currentId}`

    const showUpdateButton = !options?.autoSave || !existingIds.includes(currentId)
    const showResetButton = data && !(options?.autoSave && originalId === currentId);

    return (
        <EditorBox title="storage" themePalette="secondary">
            <ButtonGroup orientation="vertical" fullWidth>
                {(saveButton && data) &&
                    <Button size="small" onClick={(): void => { downloadJsonFile(data, type) }}>Save to file</Button>
                }
                {load &&
                    <Button size="small" onClick={load}>Load from file</Button>
                }
                {showResetButton &&
                    <Button size="small" onClick={reset}>Reset</Button>
                }
                {showUpdateButton &&
                    <Button size="small" onClick={update}>{updateButtonText}</Button>
                }
                {showDeleteButton &&
                    <ButtonWithConfirm label={deleteButtonText}
                        onClick={(): void => { deleteItem(indexOfOriginalId) }}
                    />
                }
            </ButtonGroup>

        </EditorBox>
    )
}