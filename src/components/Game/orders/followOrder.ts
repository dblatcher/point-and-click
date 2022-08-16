import { cellSize } from "..";
import { CharacterData, MoveOrder, Order } from "src";
import { CellMatrix } from "../../../lib/pathfinding/cells";
import { Point } from "../../../lib/pathfinding/geometry";
import { findPath } from "../../../lib/pathfinding/pathfind";
import { executeAction } from "./executeAct";
import { executeMove } from "./executeMove";
import { exectuteTalk } from "./executeTalk";


function findPathBetweenSteps(subject: CharacterData, cellMatrix: CellMatrix, order: MoveOrder) {

    const { steps: oldSteps } = order
    let pointReached: Point = { x: subject.x, y: subject.y }

    const newSteps = oldSteps.flatMap(step => {
        const substeps = findPath(pointReached, step, cellMatrix, cellSize) as (Point & { animation?: string, speed?: number })[]
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

export function followOrder(subject: CharacterData, cellMatrix: CellMatrix, orders?: Order[]): void {
    if (!orders || orders.length === 0) { return }
    const [nextOrder] = orders

    if (nextOrder.type === 'move') {
        if (!nextOrder.pathIsSet) {
            findPathBetweenSteps(subject, cellMatrix, nextOrder)
        }
        executeMove(nextOrder, subject)
    } else if (nextOrder.type === 'talk') {
        exectuteTalk(nextOrder)
    } else if (nextOrder.type === 'act') {
        executeAction(nextOrder)
    }

    if (nextOrder.steps.length === 0) {
        orders.shift()
    }
}
