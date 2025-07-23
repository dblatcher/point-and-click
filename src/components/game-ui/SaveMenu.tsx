import { useGameState } from "@/context/game-state-context";
import { SaveMenuProps } from "../game/uiComponentSet";

export const SaveMenu = ({ save, load, isPaused, setIsPaused }: SaveMenuProps) => {

    const { updateGameState } = useGameState();

    return <>
        {!!save &&
            <button onClick={() => save()}>SAVE</button>
        }
        <button onClick={() => updateGameState({ type: 'RESTART' })}>RESET</button>
        {!!load &&
            <button onClick={() => load()}>LOAD</button>
        }
        <button onClick={() => { setIsPaused(!isPaused) }}>{isPaused ? 'resume' : 'pause'}</button>
    </>
}