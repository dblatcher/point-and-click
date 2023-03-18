/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { eventToString } from "../../lib/util";
import { Service, ServiceItem } from "../../services/Service";
import { icons } from "./dataEditors";

import editorStyles from "./editorStyles.module.css"
import { StringInput } from "./formControls";


interface Props {
    service: Service<ServiceItem>;
    legend: string;
    select: { (item: ServiceItem): void };
    selectNone?: { (): void };
    format?: 'buttons' | 'select';
    selectedItemId?: string;
    filterItems?: { (item: ServiceItem): boolean };
    currentSelection?: string;
}

export const ServiceItemSelector: FunctionalComponent<Props> = ({
    service, select, selectNone, legend, format = 'buttons', selectedItemId = '', filterItems, currentSelection
}: Props) => {

    const [searchInput, setSearchInput] = useState('')
    const [timestamp, setTimestamp] = useState<number>(Date.now())
    const refresh = () => {
        setTimestamp(Date.now())
    }

    useEffect(() => {
        service.on('update', refresh)
        return () => {
            service.off('update', refresh)
        }
    })

    const handleSelect = (id: string) => {

        if (id === '' && selectNone) {
            return selectNone();
        }

        const item = service.get(id)
        if (item) {
            select(item)
        }
    }

    const handleDelete = (id: string) => {
        service.remove(id)
    }

    const list = filterItems
        ? service.getAll().filter(filterItems).map(item => item.id)
        : service.list();

    const searchedList = searchInput !== '' ? list.filter(id => id.toLowerCase().includes(searchInput.toLowerCase())) : list

    switch (format) {
        case 'select':
            return (
                <span updated-at={timestamp}>
                    <label>{legend}:</label>
                    <select value={selectedItemId} readonly
                        onChange={event => { handleSelect(eventToString(event)) }}>
                        <option value=''>(select)</option>
                        {list.map(id =>
                            <option key={id} value={id}>{id}</option>
                        )}
                    </select>
                </span>
            )
        case 'buttons':
        default:

            return <fieldset className={editorStyles.fieldset}>
                <legend>{legend}</legend>
                <StringInput label="search" block value={searchInput} inputHandler={setSearchInput} />
                <div updated-at={timestamp}>
                    <ul className={editorStyles.flexList}>
                        {searchedList.map(id =>
                            <li key={id}>
                                <button onClick={() => { handleSelect(id) }}>{id === currentSelection ? `** ${id} **` : id}</button>
                                <button className={[editorStyles.button, editorStyles.deleteButton].join(" ")} onClick={() => { handleDelete(id) }}>{icons.DELETE}</button>
                            </li>
                        )}
                    </ul>
                </div>
            </fieldset>
    }
}