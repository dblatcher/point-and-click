import { SayOrder } from "@/definitions";


export function exectuteSay(sayOrder: SayOrder, instantMode?:boolean): void {
    if (instantMode) {
        sayOrder.time = 0
        return
    }
    sayOrder.time--
}