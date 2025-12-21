import { GotoOrder, MoveOrder } from "point-click-lib";
import { findTarget } from "@/lib/commandFunctions";
import { GameState } from "@/lib/game-state-logic/types";
import { getTargetPoint } from "@/lib/roomFunctions";
import { findById } from "@/lib/util";


const makeEmptyMoveOrder = (): MoveOrder => ({
    type: 'move',
    pathIsSet: false,
    steps: [],
})

export function makeMoveOrderFromGoto(goToOrder: GotoOrder, state: GameState): MoveOrder {
    const { targetId, speed, animation } = goToOrder
    const { currentRoomId: roomId, rooms } = state

    const currentRoom = findById(roomId, rooms)
    if (!currentRoom) {
        console.warn('failed to room for makeMoveOrderFromGoto ', goToOrder)
        return makeEmptyMoveOrder()
    }

    const target = findTarget(
        { targetId, roomId },
        state,
        true
    )

    if (!target || target?.type === 'item') {
        console.warn('failed to find target to makeMoveOrderFromGoto ', goToOrder)
        return makeEmptyMoveOrder()
    }

    return {
        type: 'move',
        pathIsSet: false,
        steps: [{
            ...getTargetPoint(target, currentRoom),
            speed,
            animation,
        }],
        narrative: { text: [] }, // have empty narrative, since goTo order it was created from has been announced
    }
}