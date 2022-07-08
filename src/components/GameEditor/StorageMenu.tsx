import { FunctionalComponent, h } from "preact";
import styles from "./editorStyles.module.css"

interface Props {
    type: string;
    data?: { id: string };
    currentId: string;
    existingIds?: string[];
    reset: { (): void };
    update: { (): void };
    save?: { (): void };
    load?: { (): void };
}

export const StorageMenu: FunctionalComponent<Props> = ({
    type, data, currentId, existingIds = [], reset, update, save, load
}: Props) => {

    const updateButtonText = currentId === data?.id
        ? `Update ${currentId}`
        : existingIds.includes(currentId)
            ? `Over write ${currentId}`
            : `Add new ${type} ${currentId}`

    return (
        <fieldset className={styles.fieldset}>
            <legend>storage</legend>
            <div>
                {save && <button onClick={save}>Save to file</button>}
                {load && <button onClick={load}>Load from file</button>}
            </div>
            <div>
                {data && <button onClick={reset}>Reset</button>}

                {currentId && <button onClick={update}>
                    {updateButtonText}
                </button>}
            </div>
        </fieldset>
    )
}