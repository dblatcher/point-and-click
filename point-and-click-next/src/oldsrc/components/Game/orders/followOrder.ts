import { cellSize, GameState } from "..";
import { ActorData, MoveOrder, Order } from "../../../";
import { CellMatrix } from "../../../../lib/pathfinding/cells";
import { Point } from "../../../../lib/pathfinding/geometry";
import { findPath } from "../../../../lib/pathfinding/pathfind";
import { executeAction } from "./executeAct";
import { executeMove } from "./executeMove";
import { exectuteSay } from "./executeSay";
import { makeMoveOrderFromGoto } from "./makeMoveOrderFromGoto";


function findPathBetweenSteps(subject: ActorData, cellMatrix: CellMatrix, order: MoveOrder): void {

    const { steps: oldSteps } = order
    let pointReached: Point = { x: subject.x, y: subject.y }

    const newSteps = oldSteps.flatMap(step => {
        const substeps = findPath(pointReached, step, cellMatrix, cellSize) as (Point & { animation?: string; speed?: number })[]
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

/**
 * make a actor follow their next order
 * @param subject 
 * @param cellMatrix 
 * @param orders 
 * @returns whether they just finished an order that triggers the pendingInteraction
 */
export function followOrder(subject: ActorData, cellMatrix: CellMatrix, orders: Order[]|undefined, state: GameState): boolean {
    if (!orders || orders.length === 0) { return false }
    const [nextOrder] = orders

    if (nextOrder.type === 'move') {
        if (!nextOrder.pathIsSet) {
            findPathBetweenSteps(subject, cellMatrix, nextOrder)
        }
        executeMove(nextOrder, subject)
    } else if (nextOrder.type === 'say') {
        exectuteSay(nextOrder)
    } else if (nextOrder.type === 'act') {
        executeAction(nextOrder)
    } else if (nextOrder.type === 'goTo') {
        const moveOrder = makeMoveOrderFromGoto(nextOrder, state)
        orders.shift()
        orders.unshift(moveOrder)
    }

    if ('steps' in nextOrder) {
        if (nextOrder.steps.length === 0) {
            orders.shift()
            if (nextOrder.type === 'move' && nextOrder.doPendingInteractionWhenFinished) {
                return true
            }
        }
    } else if ('time' in nextOrder) {
        if (nextOrder.time <= 0) {
            orders.shift()
        }
    }
    return false
}
