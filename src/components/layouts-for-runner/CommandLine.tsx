import { findById } from "@/lib/util";
import uiStyles from './uiStyles.module.css';
import { useContext } from "react";
import { GameDataContext, UiStateContext } from "point-click-components";


export function CommandLine() {
    const { gameState, gameDesign } = useContext(GameDataContext)
    const { uiState } = useContext(UiStateContext)
    const { verbs } = gameDesign
    const verb = findById(uiState.verbId, verbs)
    const { itemId: currentItemId, hoverTarget } = uiState
    const { items } = gameState
    const item = findById(currentItemId, items)


    let text = '>'

    if (verb) {
        text = `${verb.label}`;

        if (item) {
            text += ` ${item.name || item.id} ${verb.preposition}`
        }
    }

    const hoverText = hoverTarget ? hoverTarget.name || hoverTarget.id : '...';

    return (
        <div className={uiStyles.frame}>
            <p className={uiStyles.contents}>
                <span>{text}</span>
                {hoverText && (
                    <span style={{ color: 'red' }}>{' '}{hoverText}</span>
                )}
            </p>
        </div>
    )
}