import { GameProps, GameState, cellSize } from ".";
import { Command, Interaction, RoomData, ActorData, HotspotZone, OrderConsequence } from "src";
import { makeConsequenceExecutor } from "./executeConsequence";
import { makeDebugEntry } from "../DebugLog";
import { findPath } from "../../lib/pathfinding/pathfind";
import { getDefaultResponseText, matchInteraction } from "../../lib/commandFunctions";


function doDefaultResponse(command: Command, state: GameState, unreachable = false): GameState {
    const { actors } = state
    const player = actors.find(_ => _.isPlayer)
    if (!player) { return state }
    const text = getDefaultResponseText(command, unreachable)

    if (!state.actorOrders[player.id]) {
        state.actorOrders[player.id] = []
    }

    state.actorOrders[player.id].push({
        type: 'talk',
        steps: [{ text, time: 100 }]
    })

    return state
}

const describeCommand = (command: Command): string => {
    const { verb, target, item } = command
    if (item) {
        return `[${verb.id}  ${item.id} ${verb.preposition} ${target.id}]`
    }
    return `[${verb.id} ${target.id}]`

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

function getTargetPoint(target: ActorData | HotspotZone): { x: number; y: number } {

    if (target.type === 'actor') {
        return {
            x: target.x,
            y: target.y,
        }
    }

    return {
        x: target.walkToX || target.x,
        y: target.walkToY || target.y,
    }
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

        if (interaction && interaction.mustReachFirst && command.target.type !== 'item') {
            debugLog.push(makeDebugEntry(`${describeCommand(command)}: (pending interaction at  [${command.target.x}, ${command.target.y}])`, 'command'))
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
            debugLog.push(makeDebugEntry(`${describeCommand(command)}: ${describeConsequences(interaction)}`, 'command'))
            const execute = makeConsequenceExecutor(state, props)
            interaction.consequences.forEach(execute)
        } else {
            debugLog.push(makeDebugEntry(`${describeCommand(command)}: (no match)`, 'command'))
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
