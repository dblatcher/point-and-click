import { GameData, GameDataSchema } from "point-click-lib";
import { GameState } from "./game-state-logic/types";

const SAVED_GAME_PREFIX = 'POINT_AND_CLICK'
const SAVED_GAME_DELIMITER = "//"

const getStorageKey = (gameId: string, fileName: string): string => {
    return [SAVED_GAME_PREFIX, gameId, fileName].join(SAVED_GAME_DELIMITER);
}

const extractSaveData = (gameState: GameState): GameData => {
    const {
        id, schemaVersion,
        rooms, actors, interactions, items,
        currentRoomId, actorOrders, sequenceRunning,
        conversations, currentConversationId, flagMap, gameNotBegun,
        viewAngleX, viewAngleY
    } = gameState

    return {
        id, schemaVersion,
        rooms, actors, interactions, items,
        currentRoomId, actorOrders, sequenceRunning,
        conversations, currentConversationId, flagMap, gameNotBegun,
        viewAngleX, viewAngleY
    }
}


export const save = (gameId: string) => (state: GameState, fileName = 'saved-game') => {
    const storageKey = getStorageKey(gameId, fileName);
    localStorage.setItem(storageKey, JSON.stringify(extractSaveData(state)));
}

export const listSavedGames = (gameId: string) => (): string[] => {
    const prefixAndIdAndTrailingDelimiter = [SAVED_GAME_PREFIX, gameId, ''].join(SAVED_GAME_DELIMITER)
    return Object.keys(localStorage)
        .filter(key => key.startsWith(prefixAndIdAndTrailingDelimiter))
        .map(key => key.substring(prefixAndIdAndTrailingDelimiter.length))
}

export const deleteSave = (gameId: string) => (fileName: string) => {
    const storageKey = getStorageKey(gameId, fileName)
    console.log('DELETE SAVE', fileName, storageKey)
    if (storageKey) {
        localStorage.removeItem(storageKey)
    }
}

export const load = (gameId: string) => (callback: { (data: GameData): void }, fileName = 'saved-game') => {
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