import { GameProps, GameState, cellSize } from ".";
import { Command, Interaction, RoomData, ActorData, OrderConsequence } from "src";
import { makeConsequenceExecutor } from "./executeConsequence";
import { makeDebugEntry } from "../DebugLog";
import { findPath } from "../../lib/pathfinding/pathfind";
import { getDefaultResponseText, matchInteraction, describeCommand } from "../../lib/commandFunctions";
import { getTargetPoint } from "../../lib/roomFunctions";


function doDefaultResponse(command: Command, state: GameState, unreachable = false): GameState {
    const { actors } = state
    const player = actors.find(_ => _.isPlayer)
    if (!player) { return state }
    if (!state.actorOrders[player.id]) {
        state.actorOrders[player.id] = []
    }

    if (command.verb.isMoveVerb && (command.target.type === 'actor' || command.target.type === 'hotspot')) {
        const point = getTargetPoint(command.target)
        state.debugLog.push(makeDebugEntry(`walk to point is ${point.x}, ${point.y}`, 'pathfinding'))
        state.actorOrders[player.id].push({
            type: 'move', steps: [
                { ...point }
            ]
        })
    } else {
        const text = getDefaultResponseText(command, unreachable)
        state.actorOrders[player.id].push({
            type: 'say', text, time: 250
        })
    }
    return state
}

const describeConsequences = (interaction: Interaction): string => `(${interaction.consequences?.map(_ => _.type).join()})`

function removeHoverTargetIfGone(state: GameState, currentRoom?: RoomData): GameState {
    const { hoverTarget } = state
    if (!hoverTarget) {
        return state
    }
    const player = state.actors.find(_ => _.isPlayer)

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

function makeGoToOrder(player: ActorData, target: { x: number; y: number }): OrderConsequence {
    return {
        type: 'order',
        actorId: player.id,
        replaceCurrentOrders: true,
        orders: [
            {
                type: 'move',
                doPendingInteractionWhenFinished: true,
                steps: [
                    {
                        x: target.x,
                        y: target.y,
                    }
                ]
            },
        ]
    }
}

export function handleCommand(command: Command, props: GameProps): { (state: GameState): Partial<GameState> } {

    return (state): GameState => {
        const { currentRoomId, rooms, debugLog, actors, cellMatrix = [] } = state

        const currentRoom = rooms.find(_ => _.id === currentRoomId)
        const player = actors.find(_ => _.isPlayer)
        const interaction = matchInteraction(command, currentRoom, state.interactions, state.flagMap)
        const mustReachFirst = interaction && (command.verb.isMoveVerb || interaction.mustReachFirst)

        if (interaction && mustReachFirst && command.target.type !== 'item') {
            debugLog.push(makeDebugEntry(`[${describeCommand(command)}]: (pending interaction at  [${command.target.x}, ${command.target.y}])`, 'command'))
            const targetPoint = getTargetPoint(command.target)

            if (player) {
                const isReachable = findPath(player, targetPoint, cellMatrix, cellSize).length > 0;
                if (isReachable) {
                    state.pendingInteraction = interaction
                    const execute = makeConsequenceExecutor(state, props)
                    execute(makeGoToOrder(player, targetPoint))
                } else {
                    debugLog.push(makeDebugEntry(`cannot reach [${targetPoint.x}, ${targetPoint.y}] from [${player.x},${player.y}]`, 'pathfinding'))
                    doDefaultResponse(command, state, true)
                }
            }
        } else if (interaction) {
            debugLog.push(makeDebugEntry(`[${describeCommand(command)}]: ${describeConsequences(interaction)}`, 'command'))
            const execute = makeConsequenceExecutor(state, props)
            interaction.consequences.forEach(execute)
        } else {
            debugLog.push(makeDebugEntry(`[${describeCommand(command)}]: (no match)`, 'command'))
            doDefaultResponse(command, state)
        }

        removeHoverTargetIfGone(state, currentRoom)

        return state
    }
}

export function doPendingInteraction(state: GameState, props: GameProps): GameState {
    const execute = makeConsequenceExecutor(state, props)
    state.pendingInteraction?.consequences.forEach(execute)

    if (state.pendingInteraction) {
        state.debugLog.push(makeDebugEntry(
            `Pending interaction: ${describeConsequences(state.pendingInteraction)}`,
            'command'
        ))
    }

    state.pendingInteraction = undefined
    return state
}
