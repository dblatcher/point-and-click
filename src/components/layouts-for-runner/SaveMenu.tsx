import { useLocalSavedGame } from "@/hooks/use-local-saved-games-in-runner";
import { GameDataContext } from "point-click-components";
import { useContext } from "react";

export const SaveMenu = () => {
    const { dispatch, gameState } = useContext(GameDataContext);
    const { isPaused } = gameState
    const { saveGame, loadGame, restart } = useLocalSavedGame()
    const setIsPaused = (isPaused: boolean) => { dispatch({ type: 'SET-PAUSED', isPaused }) }

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