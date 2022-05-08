import { GameProps, GameState } from ".";
import { makeConsequenceExecutor } from "./executeConsequence";
import followOrder from "./orders/followOrder";

/**
 * Takes the next step in the sequence, shifting stages the array
 * when the stage is complete, until the sequence has finished
 * @param state 
 * @returns a partial state
 */
export function continueSequence(state: GameState, props:GameProps): Partial<GameState> {
    const { characters, sequenceRunning: sequence } = state
    const characterOrders = sequence[0]?.characterOrders;

    const validCharacterIds = characters.map(_ => _.id)
    const invalidCharacterIds = Object.keys(characterOrders).filter(_ => !validCharacterIds.includes(_))

    invalidCharacterIds.forEach(_ => {
        console.warn(`invalid character id in stage: ${_}`)
        delete characterOrders[_]
    })

    const emptyOrderLists = Object.keys(characterOrders).filter(_ => characterOrders[_].length === 0)

    emptyOrderLists.forEach(_ => {
        console.log(`character finished orders in stage: ${_}`)
        delete characterOrders[_]
    })

    characters.forEach(character => followOrder(character, characterOrders[character.id]))

    if (sequence[0]?.immediateConsequences) {
        const consequenceExecutor = makeConsequenceExecutor(state,props)
        sequence[0]?.immediateConsequences.forEach(consequence => {
            console.log(`executing: ${consequence.type}`)
            consequenceExecutor(consequence)
        })
        delete sequence[0]?.immediateConsequences
    }

    const stageIsFinished = Object.keys(characterOrders).length === 0
    if (stageIsFinished) {
        sequence.shift()
        console.log(`stage finished, ${sequence.length} left.`)
    }


    return {
        characters,
        sequenceRunning: sequence.length === 0 ? undefined : sequence
    }
}
