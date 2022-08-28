/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from "preact"
import { Verb } from "src"
import styles from './styles.module.css';

interface Props {
    verbs: Verb[];
    currentVerbId: string;
    select: { (verb: Verb): void };
}

export function VerbMenu({ verbs, currentVerbId, select }: Props) {

    return (
        <nav className={styles.menu}>
            {verbs.map(verb => (
                <button key={verb.id}
                    className={currentVerbId === verb.id ? [styles.button, styles.current].join(" ") : styles.button}
                    onClick={() => { select(verb) }}>{verb.label}</button>
            ))}
        </nav>
    )
}