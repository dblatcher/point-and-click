/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { GameCondition } from "../../definitions/Game";
import styles from "./styles.module.css"

interface Props {
    condition: GameCondition;
    log: LogEntry[];
}

export type LogEntry = {
    content: string;
    time: Date;
};

export const makeDebugEntry = (content: string): LogEntry => ({
    content, time: new Date()
})

export const DebugLog: FunctionalComponent<Props> = ({
    condition, log
}: Props) => {

    const listRef = useRef<HTMLUListElement>(null)
    useEffect(() => {
        const { current: listElement } = listRef
        console.log('scrol', listElement)
        if (!listElement) { return }
        listElement.scrollTo({ left: 0, top: 10000 })
    }, [log.length])

    return (
        <aside>
            <div className={styles.layout}>
                <section className={styles.statusSection}>
                    <p>room:{condition.currentRoomId}</p>
                    <p>sequence:{condition.sequenceRunning?.id}</p>
                </section>
                <ul className={styles.loglist} ref={listRef}>
                    {log.map((entry, index) => (
                        <li key={index}>
                            {entry.time.toLocaleTimeString()}:
                            <b>{entry.content}</b>
                        </li>
                    ))}
                </ul>
            </div>
            <hr />
        </aside>
    );
};
