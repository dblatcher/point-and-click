import { CharacterData } from "../../../definitions/CharacterData";
import { Order } from "../../../definitions/Order";
import { executeMove } from "./executeMove";
import { exectuteTalk } from "./executeTalk";

export default function followOrder(character: CharacterData, orders?: Order[]): CharacterData {
    if (!orders || orders.length === 0) { return }
    const [nextOrder] = orders

    if (nextOrder.type === 'move') {
        executeMove(nextOrder, character)
    }

    if (nextOrder.type === 'talk') {
        exectuteTalk(nextOrder)
    }
    if (nextOrder.steps.length === 0) {
        orders.shift()
    }

    return character
}
