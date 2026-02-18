import { GameDataContext, UiStateContext } from 'point-click-components';
import { memo, useContext } from 'react';
import { VerbMenuProps, verbMenuPropsAreEqual } from "../game/uiComponentSet";
import uiStyles from './uiStyles.module.css';


export const VerbMenu = () => {
    const { gameDesign } = useContext(GameDataContext)
    const { uiState, dispatchUi } = useContext(UiStateContext)
    const { verbId: currentVerbId } = uiState
    const { verbs } = gameDesign
    return <VerbMenuInner
        select={(verb) => {
            if (!verb.preposition) {
                dispatchUi({ type: 'SET_ITEM' })
            }
            dispatchUi({ type: 'SET_VERB', verbId: verb.id })
        }}
        verbs={verbs}
        currentVerbId={currentVerbId}
    />
}

export const VerbMenuInner = memo(function VerbMenu({ verbs, currentVerbId, select }: VerbMenuProps) {
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