import { FunctionalComponent, h } from "preact";
import styles from "./editorStyles.module.css"

import { downloadJsonFile, } from "../../lib/files";

interface Props {
    type: string;
    data?: { id: string };
    originalId?: string;
    existingIds: string[];
    reset: { (): void };
    update: { (): void };
    saveButton?: boolean;
    load?: { (): void };
}

export const StorageMenu: FunctionalComponent<Props> = ({
    type, data, originalId, existingIds, reset, update, saveButton, load
}: Props) => {

    const currentId = data?.id || '';

    const updateButtonText = originalId === currentId
        ? `Update ${originalId}`
        : existingIds.includes(currentId)
            ? `Overwrite ${currentId}`
            : `Add new ${type} ${currentId}`

    return (
        <fieldset className={styles.fieldset}>
            <legend>storage</legend>
            <div>
                {(saveButton && data) && <button onClick={(): void => { downloadJsonFile(data, type) }}>Save to file</button>}
                {load && <button onClick={load}>Load from file</button>}
            </div>
            <div>
                {data && <button onClick={reset}>Reset</button>}

                {data?.id && <button onClick={update}>
                    {updateButtonText}
                </button>}
            </div>
        </fieldset>
    )
}