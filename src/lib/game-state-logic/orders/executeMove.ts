import { Direction, ActorData, MoveOrder } from "@/definitions";
import { Sprite } from "@/lib/Sprite";
import { Point } from "@/lib/pathfinding/geometry";

function getAvailableDirections(sprite?: Sprite, animationName?: string): Direction[] {
    const animation = sprite?.getAnimation(animationName, 'move') || {}
    return Object.keys(animation) as Direction[]
}

function determineDirection(postion: Point, desination: Point, availableDirections: Direction[]): Direction {

    const dx = desination.x - postion.x
    const dy = desination.y - postion.y

    const horizontal = dx < 0 ? 'left' : 'right'
    const vertical = dy < 0 ? 'down' : 'up';
    const moreVertical = Math.abs(dx) < Math.abs(dy);

    const ideal = moreVertical ? vertical : horizontal
    if (availableDirections.includes(ideal)) { return ideal }

    if (moreVertical) {
        return horizontal
    }
    return vertical
}


export function executeMove(moveOrder: MoveOrder, actor: ActorData, sprite?: Sprite, instantMode?: boolean): void {
    if (moveOrder.roomId && moveOrder.roomId !== actor.room) {
        console.warn(`${actor.id} is in ${actor.room ?? '[NOWHERE]'}, not ${moveOrder.roomId} - cancelling order`)
        moveOrder.steps.splice(0, moveOrder.steps.length)
    }

    if (instantMode) {
        const finalStep = moveOrder.steps[moveOrder.steps.length - 1]
        if (finalStep) {
            actor.x = finalStep.x
            actor.y = finalStep.y
            moveOrder.steps.splice(0, moveOrder.steps.length)
        }
        return
    }

    const { x, y, speed: actorSpeed = 1 } = actor
    const [nextStep] = moveOrder.steps;
    if (!nextStep) { return }
    const { speed: stepSpeed = 1 } = nextStep
    const speed = actorSpeed * stepSpeed

    let newX = x
    let newY = y

    if (x !== nextStep.x) {
        const distance = Math.min(speed, Math.abs(x - nextStep.x))
        const directionX = x < nextStep.x ? 1 : -1
        newX = x + (distance * directionX)
    }
    if (y !== nextStep.y) {
        const distance = Math.min(speed, Math.abs(y - nextStep.y))
        const directionY = y < nextStep.y ? 1 : -1
        newY = y + (distance * directionY)
    }

    if (nextStep.x == newX && nextStep.y == newY) {
        moveOrder.steps.shift()
    }

    const availableDirections = getAvailableDirections(sprite, nextStep.animation)
    actor.x = newX
    actor.y = newY
    actor.direction = determineDirection({ x, y }, { x: newX, y: newY }, availableDirections)
}