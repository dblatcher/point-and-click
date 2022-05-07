import { ActOrder } from "../../../definitions/Order";


export function executeAction(actOrder: ActOrder) {
    const [nextAction] = actOrder.steps
    if (nextAction) {
        if (typeof nextAction.timeElapsed === 'undefined') {
            nextAction.timeElapsed = 0
        }
        nextAction.timeElapsed++
        if (nextAction.timeElapsed >= nextAction.duration) {
            actOrder.steps.shift()
        }
    }
}