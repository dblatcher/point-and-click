import { FunctionComponent } from "react";
import styles from "./treeMenuStyles.module.css"

export type EntryClickFunction = { (folderId: string, data: { id: string }, isForNew?: boolean): void }
export type FolderClickFunction = { (folderId: string): void }

export interface Entry {
    label?: string;
    data: { id: string };
    active?: boolean;
    isForNew?: boolean;
}

export interface Folder {
    id: string;
    label?: string;
    open?: boolean;
    entries?: Entry[];
}

const folderStyle: h.JSX.CSSProperties = {
    listStyle: 'none',
    fontFamily: 'monospace',
}


const getFolderClass = (folder: Folder): string => (
    folder.entries
        ? folder.open ? [styles.button, styles.open].join(" ") : styles.button
        : folder.open ? [styles.button, styles.active].join(" ") : styles.button
)

const getEntryClass = (entry: Entry): string => (
    entry.active ? [styles.button, styles.active].join(" ") : styles.button
)


interface Props {
    folders: Folder[];
    folderClick: FolderClickFunction;
    entryClick: EntryClickFunction;
}

export const TreeMenu: FunctionComponent<Props> = ({ folders, folderClick, entryClick }: Props) => {

    return (
        <section className={styles.treeMenu}>
            <ul>
                {folders.map(folder => (
                    <li key={folder.id} style={folderStyle}>
                        <div>
                            <button
                                className={getFolderClass(folder)}
                                onClick={() => { folderClick(folder.id) }}>
                                <b>❯</b>
                                <span>{folder.label || folder.id}</span>
                            </button>
                            {!!(folder.open && folder.entries?.length) &&
                                <ul className={styles.entryList}>
                                    {folder.entries?.map(entry => (
                                        <li key={folder.id + entry.data.id} className={styles.row}>
                                            <button
                                                className={getEntryClass(entry)}
                                                onClick={() => { entryClick(folder.id, entry.data, entry.isForNew) }}>
                                                <b>❯</b>
                                                <span>{entry.label || entry.data.id}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            }
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    )
}