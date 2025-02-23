import { ActOrder } from "@/definitions";


export function executeAction(actOrder: ActOrder, instantMode = false, orderSpeed = 1): void {
    if (instantMode) {
        actOrder.steps.splice(0, actOrder.steps.length)
        return
    }
    const [nextAction] = actOrder.steps
    if (nextAction) {
        if (typeof nextAction.timeElapsed === 'undefined') {
            nextAction.timeElapsed = 0
        }
        nextAction.timeElapsed += orderSpeed
        if (nextAction.timeElapsed >= nextAction.duration) {
            actOrder.steps.shift()
        }
    }
}