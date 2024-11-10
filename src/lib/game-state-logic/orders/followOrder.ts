import { CELL_SIZE } from "@/lib/pathfinding/constants";
import { GameState } from "@/lib/game-state-logic/types";
import { ActorData, MoveOrder, Order } from "@/definitions";
import { CellMatrix } from "@/lib/pathfinding/cells";
import { Point } from "@/lib/pathfinding/geometry";
import { findPath } from "@/lib/pathfinding/pathfind";
import { executeAction } from "./executeAct";
import { executeMove } from "./executeMove";
import { exectuteSay } from "./executeSay";
import { makeMoveOrderFromGoto } from "./makeMoveOrderFromGoto";
import { Sprite } from "@/lib/Sprite";


function findPathBetweenSteps(subject: ActorData, cellMatrix: CellMatrix, order: MoveOrder): void {
    const { steps: oldSteps } = order
    let pointReached: Point = { x: subject.x, y: subject.y }

    const newSteps = oldSteps.flatMap(step => {
        const substeps = findPath(pointReached, step, cellMatrix, CELL_SIZE) as (Point & { animation?: string; speed?: number })[]
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

function executeOrder(nextOrder: Order, subject: ActorData, cellMatrix: CellMatrix, state: GameState, orders: Order[], sprite?: Sprite, instantMode?: boolean,) {
    switch (nextOrder.type) {
        case "move":
            if (!nextOrder.pathIsSet) {
                findPathBetweenSteps(subject, cellMatrix, nextOrder);
            }
            executeMove(nextOrder, subject, sprite, instantMode);
            break;
        case "say":
            exectuteSay(nextOrder, instantMode);
            break;
        case "act":
            executeAction(nextOrder, instantMode);
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
export function followOrder(subject: ActorData, cellMatrix: CellMatrix, orders: Order[] | undefined, state: GameState, sprite?: Sprite, instantMode?: boolean): boolean {
    if (!orders || orders.length === 0) { return false }
    // TO DO - for instantMode, should emit all the order reports here
    // one order per cycle is not really instant
    const [nextOrder] = orders

    if (!nextOrder._started) {
        state.emitter.emit('in-game-event', { type: 'order', order: nextOrder, actor: subject })
        nextOrder._started = true
    }
    executeOrder(nextOrder, subject, cellMatrix, state, orders, sprite, instantMode);

    if (orderIsFinished(nextOrder)) {
        orders.shift()
        if (nextOrder.type === 'move' && nextOrder.doPendingInteractionWhenFinished) {
            return true
        }
    }
    return false
}
