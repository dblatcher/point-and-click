import { findById } from "@/lib/util";
import { useGameState } from "@/context/game-state-context";
import uiStyles from './uiStyles.module.css';
import { useGameInfo } from "@/context/game-info-provider";


export function CommandLine() {
    const state = useGameState()
    const { verb } = useGameInfo()
    const { items, currentItemId, hoverTarget } = state
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