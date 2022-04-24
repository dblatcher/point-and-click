import { CharacterData } from "../../../lib/CharacterData";
import { MoveOrder } from "../../../lib/Order";
import { Point } from "../../../lib/pathfinding/geometry";
import { Direction } from "../../../lib/Sprite";

export function executeMove(moveOrder: MoveOrder, character: CharacterData): Point & {direction:Direction} {
    const { x, y, speed = 1, direction } = character
    const [nextStep] = moveOrder.steps;
    if (!nextStep) { return { x, y, direction } }

    let newX = x
    let newY = y
    let newDirection = direction
    if (x !== nextStep.x) {
        const distance = Math.min(speed, Math.abs(x - nextStep.x))
        const directionX = x < nextStep.x ? 1 : -1
        newX = x + (distance * directionX)
        newDirection = directionX < 0 ? 'left' : 'right'
    }
    if (y !== nextStep.y) {
        const distance = Math.min(speed, Math.abs(y - nextStep.y))
        const directionY = y < nextStep.y ? 1 : -1
        newY = y + (distance * directionY)
    }

    if (nextStep.x == newX && nextStep.y == newY) {
        moveOrder.steps.shift()
    }

    return { x: newX, y: newY, direction:newDirection }
}