import { DEFAULT_TALK_TIME } from "@/components/GameEditor/defaults";
import { describeCommand, getDefaultResponseText, matchInteraction } from "@/lib/commandFunctions";
import { GameState } from "@/lib/game-state-logic/types";
import { CELL_SIZE, findPath } from "@/lib/pathfinding";
import { getTargetPoint } from "@/lib/roomFunctions";
import { findById } from "@/lib/util";
import { ActorData, Command, Interaction, OrderConsequence } from "point-click-lib";
import { GameProps } from "../../components/game/types";
import { removeHoverTargetIfGone, removeItemIfGone } from "./clearCommand";
import { makeConsequenceExecutor } from "./executeConsequence";
import { issueOrdersOutsideSequence } from "./orders/issueOrders";
import { DebugLogger, ReportConsequence } from "./report-emitting";

function doDefaultResponse(command: Command, state: GameState, unreachable: boolean, debugLogger?: DebugLogger): GameState {
    const { actors, rooms, currentRoomId } = state
    const player = actors.find(_ => _.isPlayer)
    const currentRoom = findById(currentRoomId, rooms)

    if (!player || !currentRoom) { return state }

    if (command.verb.isMoveVerb && (command.target.type === 'actor' || command.target.type === 'hotspot')) {
        const point = getTargetPoint(command.target, currentRoom)
        debugLogger?.(`walk to point is ${point.x}, ${point.y}`, 'pathfinding')
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

export const handleCommand = (
    command: Command,
    props: GameProps,
    state: GameState,
    debugLogger?: DebugLogger,
    reportCommand?: { (command: Command): void },
    reportConsequence?: ReportConsequence
): GameState => {
    const { currentRoomId, rooms, actors, cellMatrix = [] } = state
    const currentRoom = findById(currentRoomId, rooms)
    if (!currentRoom) { return state }

    const player = actors.find(_ => _.isPlayer)
    const interaction = matchInteraction(command, currentRoom, state.interactions, state)
    const mustReachFirst = interaction && (command.verb.isMoveVerb || interaction.mustReachFirst)

    const descriptionForLog = describeCommand(command)
    reportCommand?.(command);

    if (interaction && mustReachFirst && command.target.type !== 'item') {
        debugLogger?.(`[${descriptionForLog}]: (pending interaction at  [${command.target.x}, ${command.target.y}])`, 'command')

        const targetPoint = getTargetPoint(command.target, currentRoom)

        if (player) {
            const isReachable = findPath(player, targetPoint, cellMatrix, CELL_SIZE).length > 0;
            if (isReachable) {
                state.pendingInteraction = interaction
                const execute = makeConsequenceExecutor(state, props, reportConsequence)
                execute(makeGoToOrder(player, targetPoint, props.instantMode ? undefined : command.target.name ?? command.target.id))
            } else {
                debugLogger?.(`cannot reach [${targetPoint.x}, ${targetPoint.y}] from [${player.x},${player.y}]`, 'pathfinding')
                doDefaultResponse(command, state, true, debugLogger)
            }
        }
    } else if (interaction) {
        debugLogger?.(`[${descriptionForLog}]: ${describeConsequences(interaction)}`, 'command')
        const execute = makeConsequenceExecutor(state, props, reportConsequence)
        interaction.consequences.forEach(execute)
    } else {
        debugLogger?.(`[${descriptionForLog}]: (no match)`, 'command')
        doDefaultResponse(command, state, false, debugLogger)
    }

    removeHoverTargetIfGone(state)
    removeItemIfGone(state)
    return state
}


export function doPendingInteraction(state: GameState, props: GameProps, debugLogger?: DebugLogger, reportConsequence?: ReportConsequence): GameState {
    const execute = makeConsequenceExecutor(state, props, reportConsequence)
    state.pendingInteraction?.consequences.forEach(execute)

    if (state.pendingInteraction) {
        debugLogger?.(
            `Pending interaction: ${describeConsequences(state.pendingInteraction)}`,
            'command'
        )
    }

    state.pendingInteraction = undefined
    return state
}
