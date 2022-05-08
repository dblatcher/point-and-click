import { ThingOrder } from "../../../definitions/Order";
import { ThingData } from "../../../definitions/ThingData";
import { executeAction } from "./executeAct";

export default function followThingOrder(thing: ThingData, orders?: ThingOrder[]) {
    if (!orders || orders.length === 0) { return }
    const [nextOrder] = orders

    if(nextOrder.type ==='act') {
        executeAction(nextOrder)
    }

    if (nextOrder.steps.length === 0) {
        orders.shift()
    }

}
