import { CharacterData } from "../../../definitions/CharacterData";
import { executeMove } from "./executeMove";
import { exectuteTalk } from "./executeTalk";

export default function followOrder(character: CharacterData): CharacterData {
    const [nextOrder] = character.orders
    if (!nextOrder) { return }

    if (nextOrder.type === 'move') {
        executeMove(nextOrder, character)
    }

    if (nextOrder.type === 'talk') {
        exectuteTalk(nextOrder)
    }
    if (nextOrder.steps.length === 0) {
        character.orders.shift()
    }

    return character
}
