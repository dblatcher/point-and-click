import { GameState } from "@/lib/game-state-logic/types";
import { findById } from "@/lib/util";

export const clearRemovedEntitiesFromCommand = (state: GameState): GameState => {
    const { currentItemId, items, actors, hoverTarget, currentRoomId, rooms } = state
    const player = actors.find(_ => _.isPlayer);
    const item = findById(currentItemId, items);

    const commandUpdates: Pick<GameState, 'currentItemId' | 'hoverTarget'> = {
        currentItemId,
        hoverTarget,
    }
    if (!item || !player) {
        commandUpdates.currentItemId = undefined
    } else {
        if (item.actorId !== player.id) {
            commandUpdates.currentItemId = undefined
        }
    }


    if (hoverTarget) {
        if (hoverTarget.type === 'actor') {
            const currentRoom = findById(currentRoomId, rooms)
            if (currentRoom && hoverTarget.room !== currentRoom.id) {
                commandUpdates.hoverTarget = undefined
            }
        }
        if (hoverTarget.type === 'item' && player && hoverTarget.actorId !== player.id) {
            commandUpdates.hoverTarget = undefined
        }
    }
    return { ...state, ...commandUpdates }
}