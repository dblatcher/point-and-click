import { GameProps, GameState, cellSize } from ".";
import { Command, Interaction, RoomData, ActorData, HotspotZone, OrderConsequence } from "src";
import { makeConsequenceExecutor } from "./executeConsequence";
import { makeDebugEntry } from "../DebugLog";
import { findPath } from "../../lib/pathfinding/pathfind";
import { FlagMap } from "src/definitions/Flag";


function failsOnFlags(mustBe: boolean, idList: string[], flagMap: FlagMap): boolean {
    const results: (boolean | undefined)[] = idList.map(id => {
        const flag = flagMap[id]
        if (!flag) {
            console.warn(`Invalid flag id: "${id}"`)
            return undefined
        }
        return flag.value === mustBe
    })
    return results.includes(false)
}

function matchInteraction(
    command: Command,
    room: RoomData | undefined,
    interactions: Interaction[],
    flagMap: FlagMap,
): Interaction | undefined {
    const { verb, item, target } = command
    return interactions.find(interaction => {

        const matchesCommandAndTargetStatus = interaction.verbId === verb.id
            && interaction.targetId === target.id
            && (!interaction.roomId || interaction?.roomId === room?.id)
            && ((!interaction.itemId && !item) || (interaction?.itemId == item?.id))
            && ((!interaction.targetStatus) || (interaction.targetStatus == target.status))

        if (!matchesCommandAndTargetStatus) {
            return false
        }

        if (interaction.flagsThatMustBeTrue) {
            if (failsOnFlags(true, interaction.flagsThatMustBeTrue, flagMap)) {
                return false
            }
        }

        if (interaction.flagsThatMustBeFalse) {
            if (failsOnFlags(false, interaction.flagsThatMustBeFalse, flagMap)) {
                return false
            }
        }

        return matchesCommandAndTargetStatus
    })
}

function getDefaultResponseText(command: Command, unreachable: boolean): string {
    const { verb, item, target } = command

    const { defaultResponseCannotReach, defaultResponseNoItem, defaultResponseWithItem } = verb
    const template = unreachable
        ? defaultResponseCannotReach
        : item
            ? defaultResponseWithItem
            : defaultResponseNoItem

    if (template) {
        let output = template;
        output = output.replace('$TARGET', target.name || target.id)
        output = output.replace('$ITEM', item?.name || item?.id || '')
        return output
    }

    const genericText = unreachable
        ? `I can't reach the ${target.name || target.id}`
        : item
            ? `I can't ${verb.label} the ${item.name || item.id} ${verb.preposition} the ${target.name || target.id}`
            : `Nothing happens when I ${verb.label} the ${target.name || target.id}`;

    return genericText
}

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

function makeGoToOrder(player: ActorData, target: ActorData | HotspotZone): OrderConsequence {
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
            debugLog.push(makeDebugEntry(`${describeCommand(command)}: (pending interaction)`, 'command'))

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
