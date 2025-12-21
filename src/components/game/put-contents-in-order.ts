import { CommandTarget, GameDesign } from "point-click-lib";
import { GameState } from "@/lib/game-state-logic/types";
import { putActorsInDisplayOrder } from "@/lib/roomFunctions";
import { HandleClickFunction, ActorWithOrdersAndClickHandlers } from "./types";

export const buildActorListSortedForDisplay = (
    state: GameState,
    clickHandler: HandleClickFunction<CommandTarget>,
    contextClickHandler?: HandleClickFunction<CommandTarget>
): ActorWithOrdersAndClickHandlers[] => {
    const { actors, actorOrders, sequenceRunning, rooms, currentRoomId } = state
    const currentRoom = rooms.find(_ => _.id === currentRoomId)
    const actorOrderMap = sequenceRunning ? sequenceRunning.stages[0].actorOrders || {} : actorOrders;

    const actorsInDisplayOrder = actors
        .filter(_ => _.room === currentRoom?.id)
        .sort(putActorsInDisplayOrder)

    return actorsInDisplayOrder.map(data => ({
        data,
        orders: actorOrderMap[data.id],
        clickHandler: (data.isPlayer || data.noInteraction) ? undefined : clickHandler,
        contextClickHandler: (data.isPlayer || data.noInteraction) ? undefined : contextClickHandler,
    }))
}

export const buildContentForRoomInDesign = (roomId:string, gameDesign:GameDesign): ActorWithOrdersAndClickHandlers[] => {
    const { actors } = gameDesign
    const actorsInOrder = actors
        .filter(_ => _.room === roomId)
        .sort(putActorsInDisplayOrder)

    return actorsInOrder.map(data => ({
        data,
    }))
}