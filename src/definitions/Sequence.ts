import { Order } from "./Order"

type Stage = {
    characterOrders: { [index: string]: Order[] }
}

type Sequence = Stage[]

export type { Stage, Sequence }