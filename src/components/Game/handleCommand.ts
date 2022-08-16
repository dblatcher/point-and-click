import { GameProps, GameState, cellSize } from ".";
import { Command, Interaction, RoomData, CharacterData, HotspotZone } from "src";
import { makeConsequenceExecutor } from "./executeConsequence";
import { makeDebugEntry } from "../DebugLog";
import { OrderConsequence } from "../../definitions/Interaction";
import { findPath } from "../../lib/pathfinding/pathfind";

function matchInteraction(
    command: Command,
    room: RoomData | undefined,
    interactions: Interaction[]
): Interaction | undefined {
    const { verb, item, target } = command
    return interactions.find(interaction => {
        return interaction.verbId === verb.id
            && interaction.targetId === target.id
            && (!interaction.roomId || interaction?.roomId === room?.id)
            && ((!interaction.itemId && !item) || (interaction?.itemId == item?.id))
            && ((!interaction.targetStatus) || (interaction.targetStatus == target.status))
    })
}

function doDefaultResponse(command: Command, state: GameState, unreachable = false): GameState {
    const { characters } = state
    const { verb, item, target } = command
    const player = characters.find(_ => _.isPlayer)
    if (!player) { return state }

    const text = unreachable
        ? `I can't reach the ${target.name || target.id}`
        : item
            ? `I can't ${verb.label} the ${item.name || item.id} ${verb.preposition} the ${target.name || target.id}`
            : `Nothing happens when I ${verb.label} the ${target.name || target.id}`;

    if (!state.characterOrders[player.id]) {
        state.characterOrders[player.id] = []
    }

    state.characterOrders[player.id].push({
        type: 'talk',
        steps: [{ text, time: 100 }]
    })

    return state
}

const describeCommand = (command: Command): string => `COMMAND: ${command.verb.id}, ${command.target.id} [${command.item?.id}]`
const describeConsequences = (interaction: Interaction): string => `CONSEQUENCES: ${interaction.consequences?.map(_ => _.type).join()}]`

function removeHoverTargetIfGone(state: GameState, currentRoom?: RoomData): GameState {
    const { hoverTarget } = state
    if (!hoverTarget) {
        return state
    }
    const player = state.characters.find(_ => _.isPlayer)

    if (currentRoom) {
        if (hoverTarget.type === 'character') {
            if (hoverTarget.room !== currentRoom.id) {
                state.hoverTarget = undefined
            }
        }
    }
    if (player) {
        if (hoverTarget.type === 'item' && hoverTarget.characterId !== player.id) {
            state.hoverTarget = undefined
        }
    }
    return state
}

function makeGoToOrder(player: CharacterData, target: CharacterData | HotspotZone): OrderConsequence {
    return {
        type: 'order',
        characterId: player.id,
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
        const { currentRoomId, rooms, debugLog, characters, cellMatrix = [] } = state

        const currentRoom = rooms.find(_ => _.id === currentRoomId)
        const player = characters.find(_ => _.isPlayer)
        const interaction = matchInteraction(command, currentRoom, state.interactions)

        if (interaction && interaction.mustReachFirst && command.target.type !== 'item') {
            debugLog.push(makeDebugEntry(`${describeCommand(command)}: ${describeConsequences(interaction)} (pending)`))

            if (player) {
                const isReachable = findPath(player, command.target, cellMatrix, cellSize).length > 0;
                if (isReachable) {
                    state.pendingInteraction = interaction
                    const execute = makeConsequenceExecutor(state, props)
                    execute(makeGoToOrder(player, command.target))
                } else {
                    doDefaultResponse(command, state, true)
                }
            }
        } else if (interaction) {
            debugLog.push(makeDebugEntry(`${describeCommand(command)}: ${describeConsequences(interaction)}`))
            const execute = makeConsequenceExecutor(state, props)
            interaction.consequences.forEach(execute)
        } else {
            debugLog.push(makeDebugEntry(`${describeCommand(command)}: No match`))
            doDefaultResponse(command, state)
        }

        removeHoverTargetIfGone(state, currentRoom)

        return state
    }
}

export function doPendingInteraction(state: GameState, props: GameProps): GameState {
    const execute = makeConsequenceExecutor(state, props)
    state.pendingInteraction?.consequences.forEach(execute)
    state.pendingInteraction = undefined
    return state
}
