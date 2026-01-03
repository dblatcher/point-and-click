import { describeCommand, getDefaultResponseText, matchInteraction } from "@/lib/commandFunctions";
import { DebugLogger } from "@/lib/inGameDebugging";
import { getTargetPoint } from "@/lib/roomFunctions";
import { DEFAULT_TALK_TIME, GameRuntimeOptions, InGameEventReporter } from "@/lib/types-and-constants";
import { findById } from "@/lib/util";
import { ActorData, Command, GameData, GameDesign, Interaction, OrderConsequence, findPath } from "point-click-lib";
import { makeConsequenceExecutor } from "./executeConsequence";
import { issueOrdersOutsideSequence } from "./orders/issueOrders";

function doDefaultResponse(command: Command, state: GameData, unreachable: boolean, debugLogger?: DebugLogger): GameData {
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

export const makeCommandHandler = (
    props: GameDesign & GameRuntimeOptions,
    eventReporter: InGameEventReporter,
    debugLogger?: DebugLogger,
) => (state: GameData, command: Command): GameData => {
    const { currentRoomId, rooms, actors, cellMatrix = [] } = state
    const currentRoom = findById(currentRoomId, rooms)
    if (!currentRoom) { return state }

    const player = actors.find(_ => _.isPlayer)
    const interaction = matchInteraction(command, currentRoom, state.interactions, state)
    const mustReachFirst = interaction && (command.verb.isMoveVerb || interaction.mustReachFirst)

    const descriptionForLog = describeCommand(command)
    eventReporter.reportCommand?.(command);

    if (interaction && mustReachFirst && command.target.type !== 'item') {
        debugLogger?.(`[${descriptionForLog}]: (pending interaction at  [${command.target.x}, ${command.target.y}])`, 'command')

        const targetPoint = getTargetPoint(command.target, currentRoom)

        if (player) {
            const isReachable = findPath(player, targetPoint, cellMatrix, props.cellSize).length > 0;
            if (isReachable) {
                state.pendingInteraction = interaction
                const execute = makeConsequenceExecutor(state, props, eventReporter)
                execute(makeGoToOrder(player, targetPoint, props.instantMode ? undefined : command.target.name ?? command.target.id))
            } else {
                debugLogger?.(`cannot reach [${targetPoint.x}, ${targetPoint.y}] from [${player.x},${player.y}]`, 'pathfinding')
                doDefaultResponse(command, state, true, debugLogger)
            }
        }
    } else if (interaction) {
        debugLogger?.(`[${descriptionForLog}]: ${describeConsequences(interaction)}`, 'command')
        const execute = makeConsequenceExecutor(state, props, eventReporter)
        interaction.consequences.forEach(execute)
    } else {
        debugLogger?.(`[${descriptionForLog}]: (no match)`, 'command')
        doDefaultResponse(command, state, false, debugLogger)
    }

    return state
}


export const doPendingInteraction = (
    props: GameDesign & GameRuntimeOptions,
    eventReporter: InGameEventReporter,
    debugLogger?: DebugLogger,
) => (state: GameData): GameData => {
    const execute = makeConsequenceExecutor(state, props, eventReporter)
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
