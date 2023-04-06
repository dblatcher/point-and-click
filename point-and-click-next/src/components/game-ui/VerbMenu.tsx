import { memo } from 'react'
import uiStyles from './uiStyles.module.css';
import { VerbMenuProps, verbMenuPropsAreEqual } from "../game/uiComponentSet";


export const VerbMenu = memo ( function VerbMenu({ verbs, currentVerbId, select }: VerbMenuProps) {
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
}, verbMenuPropsAreEqual)