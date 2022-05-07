import { Order } from "./Order"

type Stage = {
    characterOrders: Record<string, Order[]>
}

type Sequence = Stage[]

export type { Stage, Sequence }