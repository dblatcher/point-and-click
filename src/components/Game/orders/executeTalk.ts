import { TalkOrder } from "src";


export function exectuteTalk(talkOrder: TalkOrder): void {
    const [nextLine] = talkOrder.steps
    if (nextLine) {
        nextLine.time--
        if (nextLine.time <= 0) {
            talkOrder.steps.shift()
        }
    }
}