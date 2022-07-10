import { GameProps, GameState } from ".";
import { Order } from "../../definitions/Order";
import { CharacterData } from "../../definitions/CharacterData";
import { makeConsequenceExecutor } from "./executeConsequence";
import { followOrder } from "./orders/followOrder";


function validateOrderIdsAndClearEmpties(
    orders: Record<string, Order[]>,
    targets: CharacterData[]
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
    const { characters, sequenceRunning, cellMatrix = [] } = state
    if (!sequenceRunning) { return {} }
    const [currentStage] = sequenceRunning.stages
    if (!currentStage) { return {} }

    const { characterOrders: stageCharacterOrders = {} } = currentStage
    validateOrderIdsAndClearEmpties(stageCharacterOrders, characters)

    characters.forEach(character => followOrder(character, cellMatrix, stageCharacterOrders[character.id]))

    if (currentStage.immediateConsequences) {
        const consequenceExecutor = makeConsequenceExecutor(state, props)
        currentStage.immediateConsequences.forEach(consequence => {
            console.log(`executing: ${consequence.type}`)
            consequenceExecutor(consequence)
        })
        delete currentStage.immediateConsequences
    }

    const stageIsFinished = Object.keys(stageCharacterOrders).length === 0
    if (stageIsFinished) {
        sequenceRunning.stages.shift()
        console.log(`stage finished, ${sequenceRunning.stages.length} left.`)
    }

    return {
        characters,
        sequenceRunning: sequenceRunning.stages.length === 0 ? undefined : sequenceRunning
    }
}
