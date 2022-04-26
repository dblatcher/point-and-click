import { CharacterData } from "../../../definitions/CharacterData";
import { executeMove } from "./executeMove";
import { exectuteTalk } from "./executeTalk";

export default function followOrder(character: CharacterData): CharacterData {
    const [nextOrder] = character.orders
    if (!nextOrder) { return }

    if (nextOrder.type === 'move') {
        const newPosition = executeMove(nextOrder, character)
        character.x = newPosition.x
        character.y = newPosition.y
        character.direction = newPosition.direction
    }

    if (nextOrder.type === 'talk') {
        exectuteTalk(nextOrder)
    }
    if (nextOrder.steps.length === 0) {
        character.orders.shift()
    }

    return character
}
