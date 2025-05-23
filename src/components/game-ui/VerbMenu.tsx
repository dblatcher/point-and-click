import { memo } from 'react';
import { useGameState } from '../../context/game-state-context';
import { VerbMenuProps, verbMenuPropsAreEqual } from "../game/uiComponentSet";
import uiStyles from './uiStyles.module.css';


export const VerbMenu = () => {
    const { gameState, updateGameState, gameProps } = useGameState()
    const { currentVerbId } = gameState
    const { verbs } = gameProps
    return <VerbMenuInner
        select={(verb) => { updateGameState({ type: 'VERB-SELECT', verb }) }}
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