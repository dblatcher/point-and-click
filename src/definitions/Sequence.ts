import { ImmediateConsequence } from "./Interaction"
import { Order } from "./Order"

type Stage = {
    characterOrders: Record<string, Order[]>,
    immediateConsequences?: ImmediateConsequence[],
}

type Sequence = Stage[]

export type { Stage, Sequence }