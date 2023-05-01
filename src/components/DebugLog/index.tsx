
import { FunctionComponent, useEffect, useRef } from "react";
import { GameCondition, Order } from "@/definitions";
import { type LogEntry } from "@/lib/inGameDebugging";
import styles from "./styles.module.css"

interface Props {
    condition: GameCondition;
    log: LogEntry[];
}

export const DebugLog: FunctionComponent<Props> = ({
    condition, log
}: Props) => {

    const listRef = useRef<HTMLUListElement>(null)
    useEffect(() => {
        const { current: listElement } = listRef
        if (!listElement) { return }
        listElement.scrollTo({ left: 0, top: listElement.scrollHeight })
    }, [log.length])

    const actorsInRoom = condition.actors.filter(_ => _.room === condition.currentRoomId)

    const describeOrder = (order?: Order): [string, string] => {
        if (!order) { return ["", ""] }
        if (!('steps' in order)) {
            return [order.type, order.animation || ""]
        }
        const [currentStep] = order.steps
        return [order.type, currentStep?.animation || ""]
    }
    const getOrderDescrition = (actorId: string): [string, string] => {
        const { sequenceRunning, actorOrders } = condition
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
                    <p>room:{condition.currentRoomId}</p>
                    <p>sequence:{condition.sequenceRunning?.id}</p>
                    <p>conversation:{condition.currentConversationId}</p>
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
                            {Object.entries(condition.flagMap).map(entry => {
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
            </div>
            <hr />
        </aside >
    );
};
