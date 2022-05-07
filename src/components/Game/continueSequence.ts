import { GameState } from ".";
import followOrder from "./orders/followOrder";

/**
 * Takes the next step in the sequence, shifting stages the array
 * when the stage is complete, until the sequence has finished
 * @param state 
 * @returns a partial state
 */
export function continueSequence(state: GameState): Partial<GameState> {
    const { characters, sequenceRunning: sequence } = state
    const orderSource = sequence[0].characterOrders;

    const validCharacterIds = characters.map(_ => _.id)
    const invalidIds = Object.keys(orderSource).filter(_ => !validCharacterIds.includes(_))

    invalidIds.forEach(_ => {
        console.warn(`invalid character id in stage: ${_}`)
        delete orderSource[_]
    })

    const emptyOrderLists = Object.keys(orderSource).filter(_ => orderSource[_].length === 0)

    emptyOrderLists.forEach(_ => {
        console.log(`character finished orders in stage: ${_}`)
        delete orderSource[_]
    })

    characters.forEach(character => followOrder(character, orderSource[character.id]))

    const stageIsFinished = Object.keys(orderSource).length === 0
    if (stageIsFinished) {
        sequence.shift()
        console.log(`stage finished, ${sequence.length} left.`)
    }


    return {
        characters,
        sequenceRunning: sequence.length === 0 ? undefined : sequence
    }
}
