import { Direction, ActorData, MoveOrder } from "src";
import { Point } from "../../../../lib/pathfinding/geometry";
import spriteService from "@/services/spriteService";

function getAvailableDirections(actor: ActorData, animationName?: string): Direction[] {
    const sprite = spriteService.get(actor.sprite);
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

export function executeMove(moveOrder: MoveOrder, actor: ActorData): void {
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

    const availableDirections = getAvailableDirections(actor, nextStep.animation)
    actor.x = newX
    actor.y = newY
    actor.direction = determineDirection({ x, y }, { x: newX, y: newY }, availableDirections)
}