import { useGameState } from "@/context/game-state-context";
import { SaveMenuProps } from "../game/uiComponentSet";
import { GameData } from "@/definitions";

export const SaveMenu = ({ save, load, isPaused, setIsPaused }: SaveMenuProps) => {
    const { updateGameState } = useGameState();
    const handleLoad = (data: GameData) => updateGameState({ type: 'HANDLE-LOAD', data })

    return <>
        {!!save &&
            <button onClick={() => save()}>SAVE</button>
        }
        <button onClick={() => updateGameState({ type: 'RESTART' })}>RESET</button>
        {!!load &&
            <button onClick={() => load(handleLoad)}>LOAD</button>
        }
        <button onClick={() => { setIsPaused(!isPaused) }}>{isPaused ? 'resume' : 'pause'}</button>
    </>
}