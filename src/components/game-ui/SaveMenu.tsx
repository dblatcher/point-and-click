import { SaveMenuProps } from "../game/uiComponentSet";

export const SaveMenu = ({ save, reset, load, isPaused, setIsPaused }: SaveMenuProps) => {

    return <>
        {!!save &&
            <button onClick={() => save()}>SAVE</button>
        }
        {!!reset &&
            <button onClick={reset}>RESET</button>
        }
        {!!load &&
            <button onClick={() => load()}>LOAD</button>
        }
        <button onClick={() => { setIsPaused(!isPaused) }}>{isPaused ? 'resume' : 'pause'}</button>
    </>
}