import { CharacterData } from "../../../definitions/CharacterData";
import { Order } from "../../../definitions/Order";
import { ThingData } from "../../../definitions/ThingData";
import { executeAction } from "./executeAct";
import { executeMove } from "./executeMove";
import { exectuteTalk } from "./executeTalk";

export function followOrder(subject: CharacterData | ThingData, orders?: Order[]) {
    if (!orders || orders.length === 0) { return }
    const [nextOrder] = orders

    if (nextOrder.type === 'move' && subject.type === 'character') {
        executeMove(nextOrder, subject)
    } else if (nextOrder.type === 'talk') {
        exectuteTalk(nextOrder)
    } else if (nextOrder.type === 'act') {
        executeAction(nextOrder)
    }

    if (nextOrder.steps.length === 0) {
        orders.shift()
    }
}
