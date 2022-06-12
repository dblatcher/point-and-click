/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Service, ServiceItem } from "../services/Service";

import styles from "./editorStyles.module.css"


interface Props {
    service: Service<ServiceItem>;
    legend: string;
    select: { (item: (ServiceItem)): void };
}

export const ServiceItemSelector: FunctionalComponent<Props> = ({ service, select, legend }: Props) => {

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