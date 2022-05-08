import { ImmediateConsequence } from "./Interaction"
import { Order, ThingOrder } from "./Order"

type Stage = {
    characterOrders?: Record<string, Order[]>,
    thingOrders?: Record<string, ThingOrder[]>,
    immediateConsequences?: ImmediateConsequence[],
}

type Sequence = Stage[]

export type { Stage, Sequence }