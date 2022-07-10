import { ImmediateConsequence } from "./Interaction"
import { Order } from "./Order"

export type Stage = {
    characterOrders?: Record<string, Order[]>;
    immediateConsequences?: ImmediateConsequence[];
}

export type Sequence = {
    description?: string;
    stages: Stage[];
}
