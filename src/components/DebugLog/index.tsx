/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { Order } from "src/definitions/Order";
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

    const charactersInRoom = condition.characters.filter(_ => _.room === condition.currentRoomId)

    const describeOrder = (order?: Order): [string, string] => {
        if (!order) { return ["[no order]", ""] }
        const [currentStep] = order.steps
        return [order.type, currentStep?.animation || '[no animation]']
    }
    const getOrderDescrition = (characterId: string): [string, string] => {
        const { sequenceRunning, characterOrders } = condition
        if (sequenceRunning && sequenceRunning.stages.length > 0) {
            const [currentStage] = sequenceRunning.stages;

            if (currentStage.characterOrders && currentStage.characterOrders[characterId]) {
                const [currentStageOrder] = currentStage.characterOrders[characterId];
                return describeOrder(currentStageOrder)
            }
        }

        const orders = characterOrders[characterId]
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

                    <table>
                        <thead>
                            <tr>
                                <th />
                                <th>status</th>
                                <th>order type</th>
                                <th>animation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {charactersInRoom.map((character, index) => (
                                <tr key={index}>
                                    <th>{character.id}</th>
                                    <td>{character.status}</td>
                                    {getOrderDescrition(character.id).map((text, index2) => (
                                        <td key={index2}>{text}</td>
                                    ))}
                                </tr>
                            )
                            )}
                        </tbody>
                    </table>

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
        </aside >
    );
};
