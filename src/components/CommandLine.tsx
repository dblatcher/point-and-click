/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from "preact";
import { ItemData, CommandTarget, Verb } from "src";


interface Props {
    verb?: Verb;
    item?: ItemData;
    target?: CommandTarget;
    hoverTarget?: CommandTarget;
}

export function CommandLine({ verb, item, target, hoverTarget }: Props) {

    let text = '>'

    if (verb) {
        text = `${verb.label}`;

        if (item) {
            text += ` ${item.name || item.id} ${verb.preposition}`
        }

        if (target) {
            text += ` ${target.name || target.id}`
        }
    }

    const hoverText = hoverTarget ? hoverTarget.name || hoverTarget.id :'...';

    return (
        <p>
            <span>{text}</span>
            {!target && (
                <span style={{ color: 'red' }}>{' '}{hoverText}</span>
            )}
        </p>
    )
}