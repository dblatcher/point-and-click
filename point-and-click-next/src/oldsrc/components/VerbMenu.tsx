/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from "preact"
import { Verb } from "src"
import uiStyles from './uiStyles.module.css';

interface Props {
    verbs: Verb[];
    currentVerbId: string;
    select: { (verb: Verb): void };
}

export function VerbMenu({ verbs, currentVerbId, select }: Props) {

    return (
        <div className={uiStyles.frame}>
            <nav className={[uiStyles.contents, uiStyles.menu].join(" ")}>
                {verbs.map(verb => (
                    <button key={verb.id}
                        className={currentVerbId === verb.id ? [uiStyles.button, uiStyles.current].join(" ") : uiStyles.button}
                        onClick={() => { select(verb) }}>{verb.label}</button>
                ))}
            </nav>
        </div>
    )
}