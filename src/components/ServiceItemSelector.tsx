/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { eventToString } from "../lib/util";
import { Service, ServiceItem } from "../services/Service";

import styles from "./editorStyles.module.css"


interface Props {
    service: Service<ServiceItem>;
    legend: string;
    select: { (item: (ServiceItem)): void };
    format?: 'buttons' | 'select';
    selectedItemId?: string;
}

export const ServiceItemSelector: FunctionalComponent<Props> = ({ service, select, legend, format = 'buttons', selectedItemId='' }: Props) => {

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
        const item = service.get(id)
        if (item) {
            select(item)
        }
    }

    switch (format) {
        case 'select':
            return (
                <span updated-at={timestamp}>
                    <label>{legend}:</label>
                    <select value={selectedItemId} readonly 
                    onChange={event => { handleSelect(eventToString(event)) }}>
                        <option value=''>(select)</option>
                        {service.list().map(id =>
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
                        {service.list().map(id =>
                            <li key={id}>
                                <button onClick={() => { handleSelect(id) }}>{id}</button>
                            </li>
                        )}
                    </ul>
                </div>
            </fieldset>
    }

}