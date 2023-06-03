import { putActorsInDisplayOrder } from "@/lib/roomFunctions";
import { GameState, HandleClickFunction, RoomContentItem } from "../components/game";
import { CommandTarget } from "@/definitions";

export const buildContentsList = (state: GameState, clickHandler: HandleClickFunction<CommandTarget>): RoomContentItem[] => {
    const { actors, actorOrders, sequenceRunning, rooms, currentRoomId } = state
    const currentRoom = rooms.find(_ => _.id === currentRoomId)
    const actorOrderMap = sequenceRunning ? sequenceRunning.stages[0].actorOrders || {} : actorOrders;

    const actorsInOrder = actors
        .filter(_ => _.room === currentRoom?.id)
        .sort(putActorsInDisplayOrder)

    const contentList: RoomContentItem[] = actorsInOrder.map(data => ({
        data,
        orders: actorOrderMap[data.id],
        clickHandler: (data.isPlayer || data.noInteraction) ? undefined : clickHandler
    }))

    return contentList
}