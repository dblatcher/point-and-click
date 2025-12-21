import { useGameState } from "@/context/game-state-context"
import { GameData } from "point-click-lib"
import { GameDataSchema } from "point-click-lib"
import { getSaveData } from "@/lib/game-state-logic/state-to-save-data"
import { GameState } from "@/lib/game-state-logic/types"

const SAVED_GAME_PREFIX = 'POINT_AND_CLICK'
const SAVED_GAME_DELIMITER = "//"

const getStorageKey = (gameId: string, fileName: string): string => {
    return [SAVED_GAME_PREFIX, gameId, fileName].join(SAVED_GAME_DELIMITER);
}

const save = (gameId: string) => (state: GameState, fileName = 'saved-game') => {
    const storageKey = getStorageKey(gameId, fileName);
    localStorage.setItem(storageKey, JSON.stringify(getSaveData(state)));
}
export type SaveSavedGameFunction = ReturnType<typeof save>

const listSavedGames = (gameId: string) => (): string[] => {
    const prefixAndIdAndTrailingDelimiter = [SAVED_GAME_PREFIX, gameId, ''].join(SAVED_GAME_DELIMITER)
    return Object.keys(localStorage)
        .filter(key => key.startsWith(prefixAndIdAndTrailingDelimiter))
        .map(key => key.substring(prefixAndIdAndTrailingDelimiter.length))
}

const deleteSave = (gameId: string) => (fileName: string) => {
    const storageKey = getStorageKey(gameId, fileName)
    console.log('DELETE SAVE', fileName, storageKey)
    if (storageKey) {
        localStorage.removeItem(storageKey)
    }
}

const load = (gameId: string) => (callback: { (data: GameData): void }, fileName = 'saved-game') => {
    const storageKey = getStorageKey(gameId, fileName)
    if (!storageKey) {
        return;
    }
    const jsonString = localStorage.getItem(storageKey);
    if (!jsonString) {
        console.error("NO SAVE FILE", storageKey);
        return;
    }

    try {
        const data = JSON.parse(jsonString) as unknown;
        const gameDataparseResult = GameDataSchema.safeParse(data);

        if (!gameDataparseResult.success) {
            console.warn(gameDataparseResult.error.issues)
            throw new Error('parse fail')
        }
        if (gameDataparseResult.data.id !== gameId) {
            throw new Error('Not from the right game - ids do not match')
        }
        callback(gameDataparseResult.data)

    } catch (error) {
        console.error(error);
    }
}

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