import { GameProps, GameState } from ".";
import { Order } from "../../definitions/Order";
import { ThingData } from "../../definitions/ThingData";
import { CharacterData } from "../../definitions/CharacterData";
import { makeConsequenceExecutor } from "./executeConsequence";
import { followOrder } from "./orders/followOrder";


function validateOrderIdsAndClearEmpties(orders: Record<string, Order[]>, targets: (CharacterData | ThingData)[]) {
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
    const { characters, things, sequenceRunning } = state
    const [currentStage] = sequenceRunning
    if (!currentStage) { return {} }

    const { characterOrders: stageCharacterOrders = {}, thingOrders: stageThingOrders = {} } = currentStage
    validateOrderIdsAndClearEmpties(stageCharacterOrders, characters)
    validateOrderIdsAndClearEmpties(stageThingOrders, things)

    characters.forEach(character => followOrder(character, stageCharacterOrders[character.id]))
    things.forEach(thing => followOrder(thing, stageThingOrders[thing.id]))

    if (currentStage.immediateConsequences) {
        const consequenceExecutor = makeConsequenceExecutor(state, props)
        currentStage.immediateConsequences.forEach(consequence => {
            console.log(`executing: ${consequence.type}`)
            consequenceExecutor(consequence)
        })
        delete currentStage.immediateConsequences
    }

    const stageIsFinished = Object.keys(stageCharacterOrders).length === 0 && Object.keys(stageThingOrders).length === 0
    if (stageIsFinished) {
        sequenceRunning.shift()
        console.log(`stage finished, ${sequenceRunning.length} left.`)
    }

    return {
        characters,
        things,
        sequenceRunning: sequenceRunning.length === 0 ? undefined : sequenceRunning
    }
}
