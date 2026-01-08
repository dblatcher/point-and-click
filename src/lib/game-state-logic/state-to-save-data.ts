import { GameData } from "point-click-lib"
import { GameState } from "./types"

export const getSaveData = (gameState: GameState): GameData => {
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
