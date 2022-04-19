import { TalkOrder } from "../Order";


export function exectuteTalk(talkOrder: TalkOrder): string | undefined {
    let dialogue: string;
    const [nextLine] = talkOrder.steps

    if (nextLine) {
        dialogue = nextLine.text
        nextLine.time--
        if (nextLine.time <= 0) {
            talkOrder.steps.shift()
        }
    }

    return dialogue
}