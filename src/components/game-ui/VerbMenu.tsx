import { memo } from 'react'
import uiStyles from './uiStyles.module.css';
import { VerbMenuProps, verbMenuPropsAreEqual } from "../game/uiComponentSet";
import { Verb } from '@/definitions';
import { useGameInfo } from '../game/game-info-provider';
import { useGameState } from '../game/game-state-context';


export const VerbMenu = (props: { select: { (verb: Verb): void }; }) => {
    const { currentVerbId } = useGameState()
    const { verbs } = useGameInfo()
    return <VerbMenuInner select={props.select} verbs={verbs} currentVerbId={currentVerbId} />
}

const VerbMenuInner = memo ( function VerbMenu({ verbs, currentVerbId, select }: VerbMenuProps) {
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