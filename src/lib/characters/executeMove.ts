import { MoveOrder } from "../Order";
import { Point } from "../pathfinding/geometry";

export function exectuteMove(moveOrder: MoveOrder, x: number, y: number, speed: number): Point {

    const [nextStep] = moveOrder.path;
    if (!nextStep) { return { x, y } }

    let newX = x
    let newY = y
    if (x !== nextStep.x) {
        const distance = Math.min(speed, Math.abs(x - nextStep.x))
        const direction = x < nextStep.x ? 1 : -1
        newX = x + (distance * direction)
    }
    if (y !== nextStep.y) {
        const distance = Math.min(speed, Math.abs(y - nextStep.y))
        const direction = y < nextStep.y ? 1 : -1
        newY = y + (distance * direction)
    }

    if (nextStep.x == newX && nextStep.y == newY) {
        moveOrder.path.shift()
        console.log('step done')
    }

    return { x:newX, y:newY }
}