/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from "preact";
import { CommandTarget } from "../definitions/Command";
import { ItemData } from "../definitions/ItemData";
import { Verb } from "../definitions/Verb";

interface Props {
    verb?: Verb;
    item?: ItemData;
    target?: CommandTarget;
}

export function CommandLine({ verb, item, target }: Props) {

    let text = '>'

    if (verb) {
        text = `${verb.label}`;

        if (item) {
            text += ` ${item.name || item.id} ${verb.preposition}`
        }

        if (target) {
            text += ` ${target.name || target.id}`
        } else {
            text += '...'
        }
    }


    return <p>{text}</p>
}