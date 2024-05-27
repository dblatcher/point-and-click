import { SayOrder } from "@/definitions";


export function exectuteSay(sayOrder: SayOrder): void {
    if (!sayOrder._started) {
        console.log('NEW', sayOrder.text)
    }
    sayOrder._started = true
    sayOrder.time--
}