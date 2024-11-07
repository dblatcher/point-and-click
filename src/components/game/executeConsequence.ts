import { ActorData, CommandTarget, Consequence } from "@/definitions"
import { changeRoom } from "@/lib/changeRoom"
import { cloneData } from "@/lib/clone"
import { generateCellMatrix } from "@/lib/pathfinding/cells"
import { findById } from "@/lib/util"
import { cellSize, GameProps, GameState } from "."
import { issueOrdersOutsideSequence } from "./orders/issueOrders"
import { reportConversationBranch } from "@/lib/game-event-emitter"


export const makeConsequenceExecutor = (state: GameState, props: GameProps): { (consequence: Consequence): void } => {

    const { actors, items, rooms, currentRoomId, emitter } = state
    const player = actors.find(_ => _.isPlayer)
    const getActor = (actorId?: string): (ActorData | undefined) =>
        actorId ? actors.find(_ => _.id === actorId) : player;
    const currentRoom = rooms.find(_ => _.id === currentRoomId)

    let conseqeunceSuccess = false
    let isOffscreen = false

    return (consequence: Consequence): void => {

        switch (consequence.type) {
            case 'order': {
                const { actorId, orders } = consequence
                const actor = getActor(actorId)
                if (!actor) {
                    break
                }
                issueOrdersOutsideSequence(state, actor.id, orders, consequence.replaceCurrentOrders)
                conseqeunceSuccess = true
                isOffscreen = actor.room !== currentRoomId
                break;
            }
            case 'changeRoom': {
                const { roomId, takePlayer, x, y } = consequence;
                const point = typeof x === 'number' && typeof y === 'number' ? { x, y } : undefined
                const modification = changeRoom(roomId, takePlayer, point)(state)
                if (!modification) {
                    break
                }
                Object.assign(state, modification)
                conseqeunceSuccess = true
                break;
            }
            case 'inventory': {
                const { actorId, itemId, addOrRemove } = consequence
                const actor = getActor(actorId)
                const item = items.find(_ => _.id === itemId)
                if (!actor || !item) { break }
                if (addOrRemove === 'ADD') {
                    item.actorId = actor.id
                    conseqeunceSuccess = true
                } else if (item.actorId === actor.id) {
                    item.actorId = undefined
                    conseqeunceSuccess = true
                }
                isOffscreen = actor && actor.room !== currentRoomId
                break;
            }
            case 'removeActor': {
                const { actorId } = consequence
                const actor = actors.find(_ => _.id === actorId)
                if (!actor) { break }
                conseqeunceSuccess = true
                isOffscreen = actor.room !== currentRoomId
                actor.room = undefined;
                break;
            }
            case 'teleportActor': {
                const { actorId, roomId, x, y } = consequence
                const actor = actors.find(_ => _.id === actorId)
                if (!actor) { break }
                isOffscreen = !actor.isPlayer && actor.room !== currentRoomId && roomId !== currentRoomId;
                actor.room = roomId || actor.room
                actor.x = x
                actor.y = y
                conseqeunceSuccess = true
                break;
            }
            case 'changeStatus': {
                const { targetId, targetType, status } = consequence
                let target: CommandTarget | undefined;
                switch (targetType) {
                    case 'actor':
                        target = actors.find(_ => _.id === targetId);
                        isOffscreen = target?.room !== currentRoomId
                        break;
                    case 'item':
                        target = items.find(_ => _.id === targetId);
                        break;
                    case 'hotspot':
                        target = currentRoom?.hotspots?.find(_ => _.id === targetId)
                        break;
                }

                if (!target) {
                    break
                }
                target.status = status
                conseqeunceSuccess = true
                break;
            }
            case 'sequence': {
                const { sequence: sequenceKey } = consequence
                const originalSequence = findById(sequenceKey, props.sequences)
                if (!originalSequence) {
                    console.warn(`No such sequence ${sequenceKey}`)
                    break;
                }
                const clonedSequence = cloneData(originalSequence)
                if (state.sequenceRunning) {
                    state.sequenceRunning.id = [state.sequenceRunning.id, clonedSequence.id].join()
                    state.sequenceRunning.stages.push(...clonedSequence.stages)
                } else {
                    state.sequenceRunning = clonedSequence
                }
                conseqeunceSuccess = true
                break;
            }
            case 'conversation': {
                const { conversationId, end } = consequence
                const conversation = state.conversations.find(_ => _.id === conversationId)
                if (!conversation) {
                    console.warn(`No such conversation ${conversationId}`)
                    break
                }
                state.currentConversationId = end ? undefined : conversationId
                conseqeunceSuccess = true

                // TO DO - how to make sure this only happens after any previous consequences have finished?
                reportConversationBranch(state)
                break;
            }
            case 'ending': {
                const { endingId } = consequence
                const ending = findById(endingId, props.endings)
                if (!ending) {
                    console.warn(`no such ending "${endingId}"`)
                    break;
                }
                state.endingId = endingId
                conseqeunceSuccess = true
                break;
            }
            case 'toggleZone': {
                const { roomId, ref, on, zoneType } = consequence
                const room = findById(roomId, state.rooms)
                if (!room) {
                    break
                }
                isOffscreen = room.id !== currentRoomId
                const zoneList = zoneType === 'obstacle'
                    ? room.obstacleAreas
                    : zoneType === 'walkable'
                        ? room.walkableAreas
                        : undefined;
                if (!zoneList) {
                    break
                }
                const zone = zoneList.find(zone => zone.ref === ref)
                if (!zone) {
                    break
                }

                zone.disabled = !on
                if (currentRoom?.id === room.id) {
                    state.cellMatrix = generateCellMatrix(room, cellSize)
                }
                conseqeunceSuccess = true
                break
            }
            case 'soundEffect': {
                const { sound, volume } = consequence
                conseqeunceSuccess = !!props.soundService.play(sound, { volume })
                break;
            }
            case 'flag': {
                const { flag, on } = consequence
                const flagEntry = state.flagMap[flag]
                if (!flagEntry) {
                    console.warn(`No such flag ${flag}`)
                    break;

                }
                flagEntry.value = on
                conseqeunceSuccess = true
                break;
            }
            case 'conversationChoice': {
                const { conversationId, choiceRef, branchId, on } = consequence
                const conversation = findById(conversationId, state.conversations);
                const branch = conversation?.branches[branchId];
                const choice = branch?.choices.find(choice => choice.ref === choiceRef);

                if (!choice) {
                    console.warn('no such conversation choice:', conversationId, branchId, choiceRef)
                    break;

                }
                conseqeunceSuccess = true
                choice.disabled = !on
                break;
            }
            case 'backgroundMusic': {
                const { sound, volume, roomId } = consequence
                const room = findById(roomId, state.rooms)
                if (!room) {
                    console.warn('no such room', roomId)
                    break;
                }
                room.backgroundMusic = sound ? { soundId: sound, volume } : undefined
                break;
            }
            case 'ambientNoise': {
                const { sound, volume, roomId } = consequence
                const room = findById(roomId, state.rooms)
                if (!room) {
                    console.warn('no such room', roomId)
                    break;
                }
                room.ambientNoise = sound ? { soundId: sound, volume } : undefined
                break;
            }
            default: {
                console.warn('unsupported conseqeunce!', consequence)
                break;
            }
        }

        emitter.emit('in-game-event', { type: 'consequence', consequence, success: conseqeunceSuccess, offscreen: isOffscreen })
    }
}
