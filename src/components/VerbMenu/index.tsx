/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from "preact"
import { Verb } from "../../definitions/Verb"

interface Props {
    verbs: Verb[];
    currentVerbId: string;
    select: { (verb: Verb): void };
}

export function VerbMenu({ verbs, currentVerbId, select }: Props) {

    return (
        <nav>
            {verbs.map(verb => (
                <button key={verb.id}
                style={{
                    backgroundColor: currentVerbId === verb.id ? 'black' : 'white',
                    color: currentVerbId === verb.id ? 'white' : 'black',
                }} onClick={() => { select(verb) }}>{verb.label}</button>
            ))}
        </nav>
    )
}