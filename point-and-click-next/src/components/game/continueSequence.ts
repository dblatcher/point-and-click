import { GameProps, GameState } from ".";
import { Order, ActorData } from "@/oldsrc";
import { makeConsequenceExecutor } from "./executeConsequence";
import { followOrder } from "./orders/followOrder";
import { removeHoverTargetIfGone, removeItemIfGone } from "./clearCommand";


function validateOrderIdsAndClearEmpties(
    orders: Record<string, Order[]>,
    targets: ActorData[]
): void {
    const validIds = targets.map(_ => _.id)
    const invalidIds = Object.keys(orders).filter(_ => !validIds.includes(_))

    invalidIds.forEach(_ => {
        console.warn(`invalid id in stage: ${_}`)
        delete orders[_]
    })

    const emptyOrderLists = Object.keys(orders).filter(_ => orders[_].length === 0)

    emptyOrderLists.forEach(_ => {
        console.log(`finished orders in stage: ${_}`)
        delete orders[_]
    })
}

/**
 * Takes the next step in the sequence, shifting stages the array
 * when the stage is complete, until the sequence has finished
 * @param state 
 * @returns a partial state
 */
export function continueSequence(state: GameState, props: GameProps): Partial<GameState> {
    const { actors, sequenceRunning, cellMatrix = [] } = state
    if (!sequenceRunning) { return {} }
    const [currentStage] = sequenceRunning.stages
    if (!currentStage) { return {} }

    const { actorOrders: stageActorOrders = {} } = currentStage
    validateOrderIdsAndClearEmpties(stageActorOrders, actors)

    actors.forEach(actor => followOrder(actor, cellMatrix, stageActorOrders[actor.id], state))

    if (currentStage.immediateConsequences) {
        const consequenceExecutor = makeConsequenceExecutor(state, props)
        currentStage.immediateConsequences.forEach(consequence => {
            console.log(`executing: ${consequence.type}`)
            consequenceExecutor(consequence)
        })
        delete currentStage.immediateConsequences
    }

    const stageIsFinished = Object.keys(stageActorOrders).length === 0
    if (stageIsFinished) {
        sequenceRunning.stages.shift()
        console.log(`stage finished, ${sequenceRunning.stages.length} left.`)
        removeHoverTargetIfGone(state)
        removeItemIfGone(state)
    }

    return {
        actors,
        sequenceRunning: sequenceRunning.stages.length === 0 ? undefined : sequenceRunning
    }
}
