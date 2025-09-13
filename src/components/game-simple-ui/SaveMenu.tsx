import { useGameState } from "@/context/game-state-context";
import { useLocalSavedGame } from "@/hooks/use-local-saved-games";

export const SaveMenu = () => {
    const { updateGameState, gameState } = useGameState();
    const { isPaused } = gameState
    const { saveGame, loadGame, restart } = useLocalSavedGame()
    const setIsPaused = (isPaused: boolean) => { updateGameState({ type: 'SET-PAUSED', isPaused }) }

    return <>
        {!!saveGame &&
            <button onClick={() => saveGame()}>SAVE</button>
        }
        <button onClick={restart}>RESET</button>
        {!!loadGame &&
            <button onClick={() => loadGame()}>LOAD</button>
        }
        <button onClick={() => { setIsPaused(!isPaused) }}>{isPaused ? 'resume' : 'pause'}</button>
    </>
}