import { GameProps, GameState, cellSize } from ".";
import { Command, Interaction, ActorData, OrderConsequence } from "@/definitions";
import { makeConsequenceExecutor } from "./executeConsequence";
import { makeDebugEntry } from "@/lib/inGameDebugging";
import { findPath } from "@/lib/pathfinding/pathfind";
import { findById } from "@/lib/util";
import { getDefaultResponseText, matchInteraction, describeCommand } from "@/lib/commandFunctions";
import { getTargetPoint } from "@/lib/roomFunctions";
import { removeHoverTargetIfGone, removeItemIfGone } from "./clearCommand";

function doDefaultResponse(command: Command, state: GameState, unreachable = false): GameState {
    const { actors, rooms, currentRoomId } = state
    const player = actors.find(_ => _.isPlayer)
    const currentRoom = findById(currentRoomId, rooms)

    if (!player || !currentRoom) { return state }
    if (!state.actorOrders[player.id]) {
        state.actorOrders[player.id] = []
    }

    if (command.verb.isMoveVerb && (command.target.type === 'actor' || command.target.type === 'hotspot')) {

        const point = getTargetPoint(command.target, currentRoom)
        const log = makeDebugEntry(`walk to point is ${point.x}, ${point.y}`, 'pathfinding')
        state.emitter.emit('debugLog', log)
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
        const { currentRoomId, rooms, actors, cellMatrix = [] } = state
        const currentRoom = findById(currentRoomId, rooms)
        if (!currentRoom) { return state }

        const player = actors.find(_ => _.isPlayer)
        const interaction = matchInteraction(command, currentRoom, state.interactions, state.flagMap)
        const mustReachFirst = interaction && (command.verb.isMoveVerb || interaction.mustReachFirst)

        if (interaction && mustReachFirst && command.target.type !== 'item') {
            const log = makeDebugEntry(`[${describeCommand(command)}]: (pending interaction at  [${command.target.x}, ${command.target.y}])`, 'command')
            state.emitter.emit('debugLog', log)

            const targetPoint = getTargetPoint(command.target, currentRoom)

            if (player) {
                const isReachable = findPath(player, targetPoint, cellMatrix, cellSize).length > 0;
                if (isReachable) {
                    state.pendingInteraction = interaction
                    const execute = makeConsequenceExecutor(state, props)
                    execute(makeGoToOrder(player, targetPoint))
                } else {
                    const log = makeDebugEntry(`cannot reach [${targetPoint.x}, ${targetPoint.y}] from [${player.x},${player.y}]`, 'pathfinding')
                    state.emitter.emit('debugLog', log)
                    doDefaultResponse(command, state, true)
                }
            }
        } else if (interaction) {
            const log = makeDebugEntry(`[${describeCommand(command)}]: ${describeConsequences(interaction)}`, 'command')
            state.emitter.emit('debugLog', log)
            const execute = makeConsequenceExecutor(state, props)
            interaction.consequences.forEach(execute)
        } else {
            const log = makeDebugEntry(`[${describeCommand(command)}]: (no match)`, 'command')
            state.emitter.emit('debugLog', log)
            doDefaultResponse(command, state)
        }

        removeHoverTargetIfGone(state)
        removeItemIfGone(state)
        return state
    }
}

export function doPendingInteraction(state: GameState, props: GameProps): GameState {
    const execute = makeConsequenceExecutor(state, props)
    state.pendingInteraction?.consequences.forEach(execute)

    if (state.pendingInteraction) {
        state.emitter.emit('debugLog', makeDebugEntry(
            `Pending interaction: ${describeConsequences(state.pendingInteraction)}`,
            'command'
        ))
    }

    state.pendingInteraction = undefined
    return state
}
