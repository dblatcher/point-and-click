import { useGameState } from "@/context/game-state-context";
import { Order } from "@/definitions";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

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
        <Table size="small" >
            <TableHead>
                <TableRow>
                    <TableCell />
                    <TableCell>status</TableCell>
                    <TableCell>order type</TableCell>
                    <TableCell>animation</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {actorsInRoom.map((actor, index) => (
                    <TableRow key={index}>
                        <TableCell component='th'>{actor.id}</TableCell>
                        <TableCell>{actor.status}</TableCell>
                        {getOrderDescrition(actor.id).map((text, index2) => (
                            <TableCell key={index2}>{text}</TableCell>
                        ))}
                    </TableRow>
                )
                )}
            </TableBody>
        </Table>
    </div>)
}