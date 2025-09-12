import { useGameState } from "@/context/game-state-context"
import { getSaveData } from "@/lib/game-state-logic/state-to-save-data"
import { SaveMenuProps } from "./uiComponentSet"

interface Props {
    SaveMenuComponent: React.FunctionComponent<SaveMenuProps>
}

export const SaveMenuWrapper = ({ SaveMenuComponent }: Props) => {

    const { gameProps, gameState, updateGameState } = useGameState()
    const { deleteSave, save, load, listSavedGames } = gameProps

    return (
        <SaveMenuComponent
            load={load ? (fileName) => { load(fileName) } : undefined}
            save={save ? (fileName) => { save(getSaveData(gameState), fileName) } : undefined}
            deleteSave={deleteSave}
            listSavedGames={listSavedGames}
            isPaused={gameState.isPaused}
            setIsPaused={(isPaused) => { updateGameState({ type: 'SET-PAUSED', isPaused }) }}
        />
    )


}