import { GameDataContext } from "point-click-components"
import { useContext } from "react"


export const SoundToggle = () => {
    const { gameState, dispatch } = useContext(GameDataContext)
    return (
        <label>
            sound
            <input type="checkbox" onChange={({ target }) => {
                dispatch({ type: 'SET-SOUND-DISABLED', isSoundDisabled: !target.checked })
            }} checked={!gameState.isSoundDisabled} />
            {gameState.isSoundDisabled ? '🔇' : '🔊'}
        </label>
    )
}