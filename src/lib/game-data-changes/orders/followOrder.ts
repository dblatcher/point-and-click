import { GameRuntimeOptions, InGameEventReporter, XY } from "@/lib/types-and-constants";
import { findById } from "@/lib/util";
import { ActorData, GameData, GameDesign, MoveOrder, Order, SpriteData, findPath, type CellMatrix } from "point-click-lib";
import { executeAction } from "./executeAct";
import { executeMove } from "./executeMove";
import { executeSay } from "./executeSay";
import { makeMoveOrderFromGoto } from "./makeMoveOrderFromGoto";


function findPathBetweenSteps(subject: ActorData, cellMatrix: CellMatrix, cellSize:number, order: MoveOrder): void {
    const { steps: oldSteps } = order
    let pointReached: XY = { x: subject.x, y: subject.y }

    const newSteps = oldSteps.flatMap(step => {
        const substeps = findPath(pointReached, step, cellMatrix, cellSize) as (XY & { animation?: string; speed?: number })[]
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
    cellSize: number,
    state: GameData,
    orders: Order[],
    spriteData?: SpriteData,
    instantMode = false,
    orderSpeed = 1
) {
    switch (nextOrder.type) {
        case "move":
            if (!nextOrder.pathIsSet) {
                findPathBetweenSteps(subject, cellMatrix, cellSize, nextOrder);
            }
            executeMove(nextOrder, subject, spriteData, instantMode, orderSpeed);
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
 * make a actor do a step from their current order and remove it from the
 * start of the queue if finished
 */
export const followOrder = (
    props: GameDesign & GameRuntimeOptions,
    eventReporter: InGameEventReporter,
) => (
    state: GameData,
    subject: ActorData,
    orders: Order[] | undefined,
    triggerPendingInteraction?: { (): void },
) => {
        const { orderSpeed = 1, instantMode = false, } = props
        const { cellMatrix = [] } = state
        const spriteData = findById(subject.sprite, props.sprites)
        if (!orders || orders.length === 0) { return false }
        const [currentOrder] = orders

        if (!currentOrder._started) {
            eventReporter.reportOrder(currentOrder, subject);
            if (currentOrder.startDirection) {
                subject.direction = currentOrder.startDirection
            }
            currentOrder._started = true
        }
        executeOrder(currentOrder, subject, cellMatrix, props.cellSize, state, orders, spriteData, instantMode, orderSpeed);

        if (orderIsFinished(currentOrder)) {
            if (currentOrder.endDirection) {
                subject.direction = currentOrder.endDirection
            }
            if (currentOrder.endStatus) {
                subject.status = currentOrder.endStatus
            }
            orders.shift()
            if (currentOrder.type === 'move' && currentOrder.doPendingInteractionWhenFinished) {
                triggerPendingInteraction?.();
            }
        }
    }
