/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h, FunctionalComponent } from "preact";

interface Props {
    folders: Folder[];
    folderClick: { (folderId: string): void };
    entryClick: { (folderId: string, data: { id: string }): void };
}

interface Entry {
    label?: string;
    data: { id: string };
    active?: boolean;
}

interface Folder {
    id: string;
    label?: string;
    open?: boolean;
    entries?: Entry[];
}

const folderStyle: h.JSX.CSSProperties = {
    listStyle: 'none',
    fontFamily: 'monospace',
}
const entryStyle: h.JSX.CSSProperties = {
    listStyle: 'none',
    fontFamily: 'monospace',
    padding: '0 1rem',
}

export const TreeMenu: FunctionalComponent<Props> = ({ folders, folderClick, entryClick }: Props) => {

    return (
        <section>
            <ul>
                {folders.map(folder => (
                    <li key={folder.id} style={folderStyle}>
                        <div>
                            <span>
                                {folder.entries ? folder.open ? '🡆' : '🡇' : '🞓'}
                            </span>
                            <button onClick={() => { folderClick(folder.id) }}>{folder.label || folder.id}</button>
                            {folder.open &&
                                <ul style={entryStyle}>
                                    {folder.entries?.map(entry => (
                                        <li key={folder.id + entry.data.id}>
                                            <span>
                                                {entry.active ? '🞓🡆' : '🞑 '}
                                            </span>
                                            <button onClick={() => { entryClick(folder.id, entry.data) }}>
                                                {entry.label || entry.data.id}
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