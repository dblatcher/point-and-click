import { CharacterData } from "../../../definitions/CharacterData";
import { MoveOrder } from "../../../definitions/Order";

export function executeMove(moveOrder: MoveOrder, character: CharacterData): void {
    const { x, y, speed: characterSpeed = 1, direction = 'left' } = character
    const [nextStep] = moveOrder.steps;
    if (!nextStep) { return }
    const { speed: stepSpeed = 1 } = nextStep
    const speed = characterSpeed * stepSpeed

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

    character.x = newX
    character.y = newY
    character.direction = newDirection
}