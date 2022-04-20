import { CharacterData } from "../CharacterData";
import { MoveOrder } from "../Order";
import { Point } from "../pathfinding/geometry";

export function executeMove(moveOrder: MoveOrder, character: CharacterData): Point {
    const { x, y, speed = 1 } = character
    const [nextStep] = moveOrder.steps;
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
        moveOrder.steps.shift()
    }

    return { x: newX, y: newY }
}