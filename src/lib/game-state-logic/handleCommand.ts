import { GameState } from "@/lib/game-state-logic/types";
import { GameProps } from "../../components/game/types";
import { CELL_SIZE } from "@/lib/pathfinding/constants";
import { Command, Interaction, ActorData, OrderConsequence } from "point-click-lib";
import { makeConsequenceExecutor } from "./executeConsequence";
import { makeDebugEntry } from "@/lib/inGameDebugging";
import { findPath } from "@/lib/pathfinding/pathfind";
import { findById } from "@/lib/util";
import { getDefaultResponseText, matchInteraction, describeCommand } from "@/lib/commandFunctions";
import { getTargetPoint } from "@/lib/roomFunctions";
import { removeHoverTargetIfGone, removeItemIfGone } from "./clearCommand";
import { issueOrdersOutsideSequence } from "./orders/issueOrders";
import { DEFAULT_TALK_TIME } from "@/components/GameEditor/defaults";

function doDefaultResponse(command: Command, state: GameState, unreachable = false): GameState {
    const { actors, rooms, currentRoomId } = state
    const player = actors.find(_ => _.isPlayer)
    const currentRoom = findById(currentRoomId, rooms)

    if (!player || !currentRoom) { return state }

    if (command.verb.isMoveVerb && (command.target.type === 'actor' || command.target.type === 'hotspot')) {
        const point = getTargetPoint(command.target, currentRoom)
        const log = makeDebugEntry(`walk to point is ${point.x}, ${point.y}`, 'pathfinding')
        state.emitter.emit('debugLog', log)
        issueOrdersOutsideSequence(state, player.id, [{
            type: 'move', steps: [
                { ...point }
            ]
        }])
    } else {
        const text = getDefaultResponseText(command, unreachable)
        issueOrdersOutsideSequence(state, player.id, [{
            type: 'say', text, time: DEFAULT_TALK_TIME
        }])
    }
    return state
}

const describeConsequences = (interaction: Interaction): string => `(${interaction.consequences?.map(_ => _.type).join()})`

function makeGoToOrder(player: ActorData, targetPoint: { x: number; y: number }, targetDescription?: string): OrderConsequence {
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
                        x: targetPoint.x,
                        y: targetPoint.y,
                    }
                ],
                narrative: targetDescription
                    ? {
                        text: [
                            `making your way to ${targetDescription}...`
                        ]
                    }
                    : undefined
            },
        ]
    }
}

export function handleCommand(command: Command, props: GameProps): { (state: GameState): Partial<GameState> } {

    return (state): GameState => {
        const { currentRoomId, rooms, actors, cellMatrix = [], emitter } = state
        const currentRoom = findById(currentRoomId, rooms)
        if (!currentRoom) { return state }

        const player = actors.find(_ => _.isPlayer)
        const interaction = matchInteraction(command, currentRoom, state.interactions, state)
        const mustReachFirst = interaction && (command.verb.isMoveVerb || interaction.mustReachFirst)

        const descriptionForLog = describeCommand(command)
        emitter.emit('in-game-event', { type: 'command', command })

        if (interaction && mustReachFirst && command.target.type !== 'item') {
            const log = makeDebugEntry(`[${descriptionForLog}]: (pending interaction at  [${command.target.x}, ${command.target.y}])`, 'command')
            emitter.emit('debugLog', log)

            const targetPoint = getTargetPoint(command.target, currentRoom)

            if (player) {
                const isReachable = findPath(player, targetPoint, cellMatrix, CELL_SIZE).length > 0;
                if (isReachable) {
                    state.pendingInteraction = interaction
                    const execute = makeConsequenceExecutor(state, props)
                    execute(makeGoToOrder(player, targetPoint, props.instantMode ? undefined : command.target.name ?? command.target.id))
                } else {
                    const log = makeDebugEntry(`cannot reach [${targetPoint.x}, ${targetPoint.y}] from [${player.x},${player.y}]`, 'pathfinding')
                    emitter.emit('debugLog', log)
                    doDefaultResponse(command, state, true)
                }
            }
        } else if (interaction) {
            const log = makeDebugEntry(`[${descriptionForLog}]: ${describeConsequences(interaction)}`, 'command')
            emitter.emit('debugLog', log)
            const execute = makeConsequenceExecutor(state, props)
            interaction.consequences.forEach(execute)
        } else {
            const log = makeDebugEntry(`[${descriptionForLog}]: (no match)`, 'command')
            emitter.emit('debugLog', log)
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
