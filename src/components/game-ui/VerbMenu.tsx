import { memo } from 'react'
import uiStyles from './uiStyles.module.css';
import { VerbMenuProps, verbMenuPropsAreEqual } from "../game/uiComponentSet";
import { useGameInfo } from '@/context/game-info-provider';
import { useGameState } from '../../context/game-state-context';


export const VerbMenu = () => {
    const { gameState, dispatchGameStateAction } = useGameState()
    const { currentVerbId } = gameState
    const { verbs } = useGameInfo()
    return <VerbMenuInner
        select={(verb) => { dispatchGameStateAction({ type: 'VERB-SELECT', verb }) }}
        verbs={verbs}
        currentVerbId={currentVerbId}
    />
}

export const VerbMenuInner = memo ( function VerbMenu({ verbs, currentVerbId, select }: VerbMenuProps) {
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