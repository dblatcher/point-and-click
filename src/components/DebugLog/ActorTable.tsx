import { useGameState } from "@/context/game-state-context";
import styles from "./styles.module.css";
import { Order } from "@/definitions";
import React from "react";

export const ActorTable: React.FunctionComponent = () => {

    const { gameState } = useGameState();
    const actorsInRoom = gameState.actors.filter(_ => _.room === gameState.currentRoomId)

    const describeOrder = (order?: Order): [string, string] => {
        if (!order) { return ["", ""] }
        if (!('steps' in order)) {
            return [order.type, order.animation || ""]
        }
        const [currentStep] = order.steps
        return [order.type, currentStep?.animation || ""]
    }
    const getOrderDescrition = (actorId: string): [string, string] => {
        const { sequenceRunning, actorOrders } = gameState
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

    return (<div>
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
    </div>)
}