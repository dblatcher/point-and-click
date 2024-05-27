
import { Order } from "@/definitions";
import { useEffect, useRef, useState } from "react";
import { useGameState } from "@/context/game-state-context";
import styles from "./styles.module.css";
import { LogEntry } from "@/lib/inGameDebugging";


export const DebugLog = () => {
    const state = useGameState();
    const { emitter } = state
    const [log, setLog] = useState<LogEntry[]>([])

    useEffect(() => {
        const logEvents = (newEntry: LogEntry) => {
            setLog([...log, newEntry])
        }
        emitter.on('debugLog', logEvents)
        return () => {
            emitter.off('debugLog', logEvents)
        }
    })


    const listRef = useRef<HTMLUListElement>(null)
    useEffect(() => {
        const { current: listElement } = listRef
        if (!listElement) { return }
        listElement.scrollTo({ left: 0, top: listElement.scrollHeight })
    }, [log.length])

    const actorsInRoom = state.actors.filter(_ => _.room === state.currentRoomId)

    const describeOrder = (order?: Order): [string, string] => {
        if (!order) { return ["", ""] }
        if (!('steps' in order)) {
            return [order.type, order.animation || ""]
        }
        const [currentStep] = order.steps
        return [order.type, currentStep?.animation || ""]
    }
    const getOrderDescrition = (actorId: string): [string, string] => {
        const { sequenceRunning, actorOrders } = state
        if (sequenceRunning && sequenceRunning.stages.length > 0) {
            const [currentStage] = sequenceRunning.stages;

            if (currentStage.actorOrders && currentStage.actorOrders[actorId]) {
                const [currentStageOrder] = currentStage.actorOrders[actorId];
                return describeOrder(currentStageOrder)
            }
        }

        const orders = actorOrders[actorId]
        if (orders && orders.length > 0) {
            const [currentOrder] = orders
            return describeOrder(currentOrder)
        }
        return describeOrder()
    }

    return (
        <aside>
            <div className={styles.layout}>
                <section className={styles.statusSection}>
                    <p>room:{state.currentRoomId}</p>
                    <p>sequence:{state.sequenceRunning?.id}</p>
                    <p>conversation:{state.currentConversationId}</p>
                </section>
            </div>
            <div className={styles.layout}>
                <div>
                    <table className={styles.actorTable}>
                        <thead>
                            <tr>
                                <th />
                                <th>status</th>
                                <th>order type</th>
                                <th>animation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {actorsInRoom.map((actor, index) => (
                                <tr key={index}>
                                    <th>{actor.id}</th>
                                    <td>{actor.status}</td>
                                    {getOrderDescrition(actor.id).map((text, index2) => (
                                        <td key={index2}>{text}</td>
                                    ))}
                                </tr>
                            )
                            )}
                        </tbody>
                    </table>

                    <table className={styles.actorTable}>
                        <thead>
                            <tr>
                                <th>Flag</th>
                                <th>value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(state.flagMap).map(entry => {
                                if (!entry || !entry[1]) { return null }
                                const [flagKey, flag] = entry;
                                return <tr key={flagKey}>
                                    <td>{flagKey}</td>
                                    <td>{flag?.value ? 'TRUE' : 'FALSE'}</td>
                                    <td>{flag?.description}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>

                </div>

                <div style={{ flex: 1 }}>
                    <ul className={styles.loglist} ref={listRef} style={{ height: '100px' }}>
                        {log.map((entry, index) => (
                            <li key={index}>
                                <b>
                                    {entry.time.toLocaleTimeString()}:
                                </b>
                                {entry.content}
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => { setLog([]) }}>clear log</button>
                </div>
            </div>
            <hr />
        </aside >
    );
};
