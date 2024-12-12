import { useGameState, useGameStateDerivations } from "@/context/game-state-context";
import { findById } from "@/lib/util";
import uiStyles from './uiStyles.module.css';


export function CommandLine() {
    const { gameState } = useGameState()
    const { verb } = useGameStateDerivations()
    const { items, currentItemId, hoverTarget } = gameState
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