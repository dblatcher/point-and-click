import { GameProps } from "../../components/game/types";
import { GameState } from "@/lib/game-state-logic/types";
import { Order, ActorData } from "@/definitions";
import { makeConsequenceExecutor } from "./executeConsequence";
import { followOrder } from "./orders/followOrder";
import { removeHoverTargetIfGone, removeItemIfGone } from "./clearCommand";
import { findById } from "@/lib/util";
import { reportConversationBranch } from "@/lib/game-event-emitter";


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

    if (!currentStage._started) {
        currentStage._started = true
        console.log('starting stage', currentStage)
        state.emitter.emit('in-game-event', { type: 'sequence-stage', stage: currentStage })
    }

    const { actorOrders: stageActorOrders = {} } = currentStage
    validateOrderIdsAndClearEmpties(stageActorOrders, actors)

    actors.forEach(actor => followOrder(
        actor,
        cellMatrix,
        stageActorOrders[actor.id],
        state,
        findById(actor.sprite, props._sprites),
        props.instantMode,
    ))

    if (currentStage.immediateConsequences) {
        const consequenceExecutor = makeConsequenceExecutor(state, props)
        currentStage.immediateConsequences.forEach(consequence => {
            console.log(`executing: ${consequence.type}`)
            consequenceExecutor(consequence)
        })
        delete currentStage.immediateConsequences
    }

    const currentStageIsFinished = Object.keys(stageActorOrders).length === 0
    if (currentStageIsFinished) {
        sequenceRunning.stages.shift()
        removeHoverTargetIfGone(state)
        removeItemIfGone(state)
    }

    const [nextStage] = sequenceRunning.stages;

    if (!nextStage && state.currentConversationId) {
        reportConversationBranch(state)
    }

    return {
        actors,
        currentConversationId: state.currentConversationId,
        currentStoryBoardId: state.currentStoryBoardId,
        sequenceRunning: sequenceRunning.stages.length === 0 ? undefined : sequenceRunning
    }
}
