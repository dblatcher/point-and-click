import { cellSize, GameProps, GameState } from "."
import { CommandTarget, ActorData, Consequence, Order } from "@/definitions"
import { cloneData } from "@/lib/clone"
import { changeRoom } from "@/lib/changeRoom"
import { findById } from "@/lib/util"
import { generateCellMatrix } from "@/lib/pathfinding/cells"
import soundService from "@/services/soundService"


export const makeConsequenceExecutor = (state: GameState, props: GameProps): { (consequence: Consequence): void } => {

    const { actors, items, rooms, currentRoomId, actorOrders } = state
    const player = actors.find(_ => _.isPlayer)
    const getActor = (actorId?: string): (ActorData | undefined) =>
        actorId ? actors.find(_ => _.id === actorId) : player;
    const currentRoom = rooms.find(_ => _.id === currentRoomId)

    return (consequence: Consequence): void => {

        switch (consequence.type) {
            case 'order': {
                const { actorId, orders } = consequence
                const actor = getActor(actorId)
                if (!actor) { return }
                const clonedOrders = JSON.parse(JSON.stringify(orders)) as Order[]

                if (consequence.replaceCurrentOrders) {
                    actorOrders[actor.id] = clonedOrders
                } else if (actorOrders[actor.id]) {
                    actorOrders[actor.id].push(...clonedOrders)
                } else {
                    actorOrders[actor.id] = clonedOrders
                }

                break;
            }
            case 'changeRoom': {
                const { roomId, takePlayer, x, y } = consequence;
                const point = typeof x === 'number' && typeof y === 'number' ? { x, y } : undefined
                const modificationFunction = changeRoom(roomId, takePlayer, point)
                Object.assign(state, modificationFunction(state))
                break;
            }
            case 'inventory': {
                const { actorId, itemId, addOrRemove } = consequence
                const actor = getActor(actorId)
                const item = items.find(_ => _.id === itemId)
                if (!actor || !item) { return }

                if (addOrRemove === 'ADD') {
                    item.actorId = actor.id

                } else if (item.actorId === actor.id) {
                    item.actorId = undefined
                }
                break;
            }
            case 'removeActor': {
                const { actorId } = consequence
                const actor = actors.find(_ => _.id === actorId)
                if (!actor) { return }
                actor.room = undefined;
                break;
            }
            case 'teleportActor': {
                const { actorId, roomId, x, y } = consequence
                const actor = actors.find(_ => _.id === actorId)
                if (!actor) { return }
                actor.room = roomId || actor.room
                actor.x = x
                actor.y = y
                break;
            }
            case 'changeStatus': {
                const { targetId, targetType, status } = consequence
                let target: CommandTarget | undefined;
                switch (targetType) {
                    case 'actor':
                        target = actors.find(_ => _.id === targetId);
                        break;
                    case 'item':
                        target = items.find(_ => _.id === targetId);
                        break;
                    case 'hotspot':
                        target = currentRoom?.hotspots?.find(_ => _.id === targetId)
                        break;
                }

                if (target) {
                    target.status = status
                }
                break;
            }
            case 'sequence': {
                const { sequence: sequenceKey } = consequence
                const originalSequence = findById(sequenceKey, props.sequences)
                if (originalSequence) {
                    const clonedSequence = cloneData(originalSequence)
                    if (state.sequenceRunning) {
                        state.sequenceRunning.id = [state.sequenceRunning.id, clonedSequence.id].join()
                        state.sequenceRunning.stages.push(...clonedSequence.stages)
                    } else {
                        state.sequenceRunning = clonedSequence
                    }
                } else {
                    console.warn(`No such sequence ${sequenceKey}`)
                }
                break;
            }
            case 'conversation': {
                const { conversationId, end } = consequence
                const conversation = state.conversations.find(_ => _.id === conversationId)
                if (conversation && !end) {
                    state.currentConversationId = conversationId;
                } else if (end) {
                    state.currentConversationId = undefined;
                } else {
                    console.warn(`No such conversation ${conversationId}`)
                }
                break;
            }
            case 'ending': {
                const { endingId } = consequence
                const ending = findById(endingId, props.endings)
                if (!ending) {
                    console.warn(`no such ending "${endingId}"`)
                } else {
                    state.endingId = endingId
                }
                break;
            }
            case 'toggleZone': {
                const { roomId, ref, on, zoneType } = consequence
                const room = findById(roomId, state.rooms)
                if (room) {
                    const zoneList = zoneType === 'obstacle'
                        ? room.obstacleAreas
                        : zoneType === 'walkable'
                            ? room.walkableAreas
                            : undefined;
                    if (zoneList) {
                        const zone = zoneList.find(zone => zone.ref === ref)
                        if (zone) {
                            zone.disabled = !on
                            if (currentRoom?.id === room.id) {
                                state.cellMatrix = generateCellMatrix(room, cellSize)
                            }
                        }
                    }
                }
                break
            }
            case 'soundEffect': {
                const { sound, volume } = consequence
                soundService.play(sound, { volume })
                break;
            }
            case 'flag': {
                const { flag, on } = consequence
                const flagEntry = state.flagMap[flag]
                if (flagEntry) {
                    flagEntry.value = on
                } else {
                    console.warn(`No such flag ${flag}`)
                }
                break;
            }
            case 'conversationChoice': {
                const { conversationId, choiceRef, branchId, on } = consequence
                const conversation = findById(conversationId, state.conversations);
                const branch = conversation?.branches[branchId];
                const choice = branch?.choices.find(choice => choice.ref === choiceRef);

                if (choice) {
                    choice.disabled = !on
                } else {
                    console.warn('no such conversation choice:', conversationId, branchId, choiceRef)
                }
                break;
            }
            default: {
                console.warn('unsupported conseqeunce!', consequence)
                break;
            }
        }
    }
}
