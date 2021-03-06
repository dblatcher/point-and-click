/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { eventToString } from "../../lib/util";
import { Service, ServiceItem } from "../../services/Service";

import styles from "./editorStyles.module.css"


interface Props {
    service: Service<ServiceItem>;
    legend: string;
    select: { (item: ServiceItem): void };
    selectNone?: { (): void };
    format?: 'buttons' | 'select';
    selectedItemId?: string;
    filterItems?: { (item: ServiceItem): boolean };
}

export const ServiceItemSelector: FunctionalComponent<Props> = ({ service, select, selectNone, legend, format = 'buttons', selectedItemId = '', filterItems }: Props) => {

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

    const list = filterItems
        ? service.getAll().filter(filterItems).map(item => item.id)
        : service.list();

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
            return <fieldset className={styles.fieldset}>
                <legend>{legend}</legend>
                <div updated-at={timestamp}>
                    <ul>
                        {list.map(id =>
                            <li key={id}>
                                <button onClick={() => { handleSelect(id) }}>{id}</button>
                            </li>
                        )}
                    </ul>
                </div>
            </fieldset>
    }

}