import { GameProps, GameState } from ".";
import { Command, Interaction, RoomData } from "src";
import { makeConsequenceExecutor } from "./executeConsequence";
import { makeDebugEntry } from "../DebugLog";

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

function doDefaultResponse(command: Command, state: GameState): GameState {
    const { characters } = state
    const { verb, item, target } = command
    const player = characters.find(_ => _.isPlayer)
    if (!player) { return state }

    const text = item
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
const describeConsequences = (interaction: Interaction): string => `CONSEQUENCES: ${interaction.consequences?.map(_=>_.type).join()}]`

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

export function handleCommand(command: Command, props: GameProps): { (state: GameState): Partial<GameState> } {

    return (state): GameState => {
        const { currentRoomId, rooms, debugLog } = state

        const currentRoom = rooms.find(_ => _.id === currentRoomId)
        const matchingInteraction = matchInteraction(command, currentRoom, state.interactions)

        if (matchingInteraction) {
            debugLog.push(makeDebugEntry(`${describeCommand(command)}: ${describeConsequences(matchingInteraction)}`))
            const execute = makeConsequenceExecutor(state, props)
            matchingInteraction.consequences.forEach(execute)
        } else {
            debugLog.push(makeDebugEntry(`${describeCommand(command)}: No match`))
            doDefaultResponse(command, state)
        }

        removeHoverTargetIfGone(state, currentRoom)

        return state
    }
}