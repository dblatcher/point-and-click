import { TalkOrder } from "../../../definitions/Order";


export function exectuteTalk(talkOrder: TalkOrder) {
    const [nextLine] = talkOrder.steps
    if (nextLine) {
        nextLine.time--
        if (nextLine.time <= 0) {
            talkOrder.steps.shift()
        }
    }
}