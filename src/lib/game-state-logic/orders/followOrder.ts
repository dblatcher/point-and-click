import { GameState } from "@/lib/game-state-logic/types";
import { CELL_SIZE, findPath, type CellMatrix } from "@/lib/pathfinding";
import { Sprite } from "@/lib/Sprite";
import { ActorData, MoveOrder, Order } from "point-click-lib";
import { XY } from "typed-geometry";
import { executeAction } from "./executeAct";
import { executeMove } from "./executeMove";
import { executeSay } from "./executeSay";
import { makeMoveOrderFromGoto } from "./makeMoveOrderFromGoto";


function findPathBetweenSteps(subject: ActorData, cellMatrix: CellMatrix, order: MoveOrder): void {
    const { steps: oldSteps } = order
    let pointReached: XY = { x: subject.x, y: subject.y }

    const newSteps = oldSteps.flatMap(step => {
        const substeps = findPath(pointReached, step, cellMatrix, CELL_SIZE) as (XY & { animation?: string; speed?: number })[]
        substeps.forEach(subStep => {
            subStep.animation = step.animation
            subStep.speed = step.speed
        })
        if (substeps.length === 0) {
            console.warn('failed to findPathBetweenSteps')
            pointReached = { x: step.x, y: step.y }
        } else {
            pointReached = substeps[substeps.length - 1]
        }

        return substeps
    })

    order.pathIsSet = true
    order.steps = newSteps
}

function executeOrder(
    nextOrder: Order, 
    subject: ActorData, 
    cellMatrix: CellMatrix, 
    state: GameState, 
    orders: Order[],
    sprite?: Sprite, 
    instantMode = false, 
    orderSpeed = 1
) {
    switch (nextOrder.type) {
        case "move":
            if (!nextOrder.pathIsSet) {
                findPathBetweenSteps(subject, cellMatrix, nextOrder);
            }
            executeMove(nextOrder, subject, sprite, instantMode, orderSpeed);
            break;
        case "say":
            executeSay(nextOrder, instantMode, orderSpeed);
            break;
        case "act":
            executeAction(nextOrder, instantMode, orderSpeed);
            break;
        case "goTo": {
            const moveOrder = makeMoveOrderFromGoto(nextOrder, state);
            orders.shift();
            orders.unshift(moveOrder);
            break;
        }
    }

}

const orderIsFinished = (order: Order): boolean => {
    switch (order.type) {
        case "move":
        case "act":
            return order.steps.length === 0
        case "say":
            return order.time <= 0
        case "goTo":
            return false
    }
}

/**
 * make a actor follow their next order
 * @param subject 
 * @param cellMatrix 
 * @param orders a list of orders, either from a sequence.actorOrders or GameState.actorOrders
 * @returns whether they just finished an order that triggers the pendingInteraction
 */
export function followOrder(subject: ActorData, cellMatrix: CellMatrix, orders: Order[] | undefined, state: GameState, sprite?: Sprite, instantMode = false, orderSpeed = 1): boolean {
    if (!orders || orders.length === 0) { return false }
    const [currentOrder] = orders

    if (!currentOrder._started) {
        state.emitter.emit('in-game-event', { type: 'order', order: currentOrder, actor: subject })
        if (currentOrder.startDirection) {
            subject.direction = currentOrder.startDirection
        }
        currentOrder._started = true
    }
    executeOrder(currentOrder, subject, cellMatrix, state, orders, sprite, instantMode, orderSpeed);

    if (orderIsFinished(currentOrder)) {
        if (currentOrder.endDirection) {
            subject.direction = currentOrder.endDirection
        }
        if (currentOrder.endStatus) {
            subject.status = currentOrder.endStatus
        }
        orders.shift()
        if (currentOrder.type === 'move' && currentOrder.doPendingInteractionWhenFinished) {
            return true
        }
    }
    return false
}
