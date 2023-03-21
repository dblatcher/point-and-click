import { findById } from "../../../lib/util"
import { GameState } from "."

export function removeHoverTargetIfGone(state: GameState): GameState {
    const { hoverTarget, rooms, currentRoomId, actors } = state
    if (!hoverTarget) {
        return state
    }
    const player = actors.find(_ => _.isPlayer)
    const currentRoom = findById(currentRoomId, rooms)

    if (currentRoom) {
        if (hoverTarget.type === 'actor') {
            if (hoverTarget.room !== currentRoom.id) {
                state.hoverTarget = undefined
            }
        }
    }
    if (player) {
        if (hoverTarget.type === 'item' && hoverTarget.actorId !== player.id) {
            state.hoverTarget = undefined
        }
    }
    return state
}

export function removeItemIfGone(state: GameState): GameState {
    const { currentItemId, items } = state
    const item = findById(currentItemId, items)
    if (!item) {
        return state
    }
    const player = state.actors.find(_ => _.isPlayer)

    if (player) {
        if (item.actorId !== player.id) {
            state.currentItemId = undefined
        }
    }
    return state
}