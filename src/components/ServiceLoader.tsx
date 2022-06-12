/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Service, ServiceItem } from "../services/Service";

import styles from "./editorStyles.module.css"


interface Props {
    service: Service<ServiceItem>;
    select: { (item: (ServiceItem)): void };
}

export const ServiceLoader: FunctionalComponent<Props> = ({ service, select }: Props) => {

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

        <div updated-at={timestamp}>
            <label>load existing</label>
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