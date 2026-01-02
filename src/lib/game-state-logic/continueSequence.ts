import { reportConversationBranch } from "@/lib/game-event-emitter";
import { GameState } from "@/lib/game-state-logic/types";
import { findById } from "@/lib/util";
import { ActorData, Order } from "point-click-lib";
import { GameProps } from "../../components/game/types";
import { makeConsequenceExecutor } from "./executeConsequence";
import { followOrder } from "./orders/followOrder";
import { InGameEventReporter } from "./report-emitting";


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
export function continueSequence(
    state: GameState,
    props: GameProps,
    { reportOrder, reportStage, reportCurrentConversation, reportConsequence }: InGameEventReporter,
): Partial<GameState> {
    const { actors, sequenceRunning, cellMatrix = [] } = state
    if (!sequenceRunning) { return {} }
    const [currentStage] = sequenceRunning.stages
    if (!currentStage) { return {} }

    if (!currentStage._started) {
        currentStage._started = true
        console.log('starting stage', currentStage)
        reportStage?.(currentStage)
    }

    const { actorOrders: stageActorOrders = {} } = currentStage
    validateOrderIdsAndClearEmpties(stageActorOrders, actors)

    actors.forEach(actor => followOrder(
        actor,
        cellMatrix,
        stageActorOrders[actor.id],
        state,
        {
            orderSpeed: props.orderSpeed,
            sprite: findById(actor.sprite, props._sprites),
            instantMode: props.instantMode,
            onOrderStart: order => reportOrder?.(order, actor),
        },
    ))

    if (currentStage.immediateConsequences) {
        const consequenceExecutor = makeConsequenceExecutor(state, props, reportCurrentConversation, reportConsequence)
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
        reportConversationBranch(state)
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
