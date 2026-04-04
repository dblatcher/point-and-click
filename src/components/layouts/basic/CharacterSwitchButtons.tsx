import { GameDataContext } from "point-click-components"
import { getActorsPlayerCanSwitchTo } from "point-click-lib"
import { useContext } from "react"
import uiStyles from './uiStyles.module.css';

export const CharacterSwitchButtons = () => {
    const { gameState, dispatch } = useContext(GameDataContext)
    const availablePlayerCharacters = getActorsPlayerCanSwitchTo(gameState, true);
    const canSwitch = availablePlayerCharacters.some(a => !a.isPlayer);

    if (!canSwitch) {
        return null
    }

    return <div className={uiStyles.frame}>
        <div className={[uiStyles.contents, uiStyles.menu].join(" ")}>
            {availablePlayerCharacters.map((actor, index) => (
                <button key={index}
                    className={actor.isPlayer ? [uiStyles.button, uiStyles.current].join(" ") : uiStyles.button}
                    disabled={actor.isPlayer}
                    onClick={() => {
                        dispatch({ type: 'SWITCH-PLAYER', actorId: actor.id })
                    }}>{actor.name ?? actor.id}</button>
            ))}
        </div>
    </div>
}
