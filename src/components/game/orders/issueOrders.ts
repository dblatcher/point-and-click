import { Order } from "@/definitions";
import { GameState } from "..";
import { cloneData } from "@/lib/clone";

/** 
 * append or replace state.actorOrders for a given actor 
 * Does not effect the orders issued as part of a sequence/conversation
 * */
export const issueOrdersOutsideSequence = (state: GameState, actorId: string, orders: Order[], replaceCurrentOrders?: boolean): GameState => {
    const { actorOrders } = state
    const clonedOrders = cloneData(orders)

    if (replaceCurrentOrders) {
        actorOrders[actorId] = clonedOrders
    } else if (actorOrders[actorId]) {
        actorOrders[actorId].push(...clonedOrders)
    } else {
        actorOrders[actorId] = clonedOrders
    }

    return state
}