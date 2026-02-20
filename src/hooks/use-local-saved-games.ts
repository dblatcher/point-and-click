import { useGameState } from "@/context/game-state-context"
import { GameData, localStorageSaves } from "point-click-lib"

const { listSavedGames, load, save, deleteSave } = localStorageSaves;

export const useLocalSavedGame = () => {
    const { updateGameState, gameState, gameProps: { allowLocalSaves } } = useGameState();
    const restart = () => updateGameState({ type: 'RESTART' });

    if (!allowLocalSaves) {
        return {
            restart
        }
    }

    const saveGame = (fileName?: string) => save(gameState.id)(gameState, fileName);
    const loadCallback = (data: GameData) => updateGameState({ type: 'HANDLE-LOAD', data });
    const loadGame = (fileName?: string) => load(gameState.id)(loadCallback, fileName);

    return {
        saveGame,
        loadGame,
        listSavedGames: listSavedGames(gameState.id),
        deleteSave: deleteSave(gameState.id),
        restart
    }
}