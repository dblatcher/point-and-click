import { ActorData, GameData, GameRunnerProps, InGameEventReporter, Order } from "point-click-lib";
import { DebugLogger } from "../inGameDebugging";
import { makeConsequenceExecutor } from "./executeConsequence";
import { followOrder } from "./orders/followOrder";


function validateOrderIdsAndClearEmpties(
    orders: Record<string, Order[]>,
    targets: ActorData[]
): void {
    const validIds = targets.map(_ => _.id)
    const invalidIds = Object.keys(orders).filter(id => !validIds.includes(id))

    invalidIds.forEach(id => {
        console.warn(`invalid id in stage: ${id}`)
        delete orders[id]
    })

    const emptyOrderLists = Object.keys(orders).filter(key => orders[key].length === 0)

    emptyOrderLists.forEach(_ => {
        delete orders[_]
    })
}

/**
 * Takes the next step in the sequence, shifting stages the array
 * when the stage is complete, until the sequence has finished
 * @returns a partial state
 */
export const continueSequence = (
    props: GameRunnerProps,
    eventReporter: InGameEventReporter,
    debugLogger: DebugLogger,
) => (state: GameData): Partial<GameData> => {
    const { reportStage, reportCurrentConversation } = eventReporter
    const { actors, sequenceRunning } = state
    if (!sequenceRunning) { return {} }
    const [currentStage] = sequenceRunning.stages
    if (!currentStage) { return {} }

    if (!currentStage._started) {
        currentStage._started = true
        debugLogger(`starting next stage in sequence ${sequenceRunning.id}`)
        reportStage?.(currentStage)
    }

    const { actorOrders: stageActorOrders = {} } = currentStage
    validateOrderIdsAndClearEmpties(stageActorOrders, actors)

    actors.forEach(actor => followOrder(props, eventReporter)(
        state,
        actor,
        stageActorOrders[actor.id],
    ))

    if (currentStage.immediateConsequences) {
        const consequenceExecutor = makeConsequenceExecutor(state, props, eventReporter)
        currentStage.immediateConsequences.forEach(consequence => {
            console.log(`executing: ${consequence.type}`)
            consequenceExecutor(consequence)
        })
        delete currentStage.immediateConsequences
    }

    const currentStageIsFinished = Object.keys(stageActorOrders).length === 0
    if (currentStageIsFinished) {
        sequenceRunning.stages.shift()
    }

    const [nextStage] = sequenceRunning.stages;

    if (!nextStage && state.currentConversationId) {
        reportCurrentConversation()
    }

    return {
        actors,
        currentConversationId: state.currentConversationId,
        currentStoryBoardId: state.currentStoryBoardId,
        currentRoomId: state.currentRoomId,
        cellMatrix: state.cellMatrix,
        sequenceRunning: sequenceRunning.stages.length === 0 ? undefined : sequenceRunning
    }
}
