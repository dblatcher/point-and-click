import { SayOrder } from "@/definitions";


export function executeSay(sayOrder: SayOrder, instantMode=false, orderSpeed = 1): void {
    if (instantMode) {
        sayOrder.time = 0
        return
    }
    sayOrder.time -= orderSpeed
}