import { GameProps, GameState } from ".";
import { Command } from "../../definitions/Command";
import { Interaction } from "../../definitions/Interaction";
import { RoomData } from "../../definitions/RoomData";
import { makeConsequenceExecutor } from "./executeConsequence";

function matchInteraction(
    command: Command,
    room: RoomData | undefined,
    interactions: Interaction[]
): Interaction | undefined {
    const { verb, item, target } = command
    return interactions.find(interaction => {
        return interaction.verbId === verb.id
            && interaction.targetId === target.id
            && (!interaction.roomId || interaction?.roomId === room?.name)
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

function removeHoverTargetIfGone(state: GameState, currentRoom?: RoomData): GameState {
    const { hoverTarget } = state
    if (!hoverTarget) {
        return state
    }
    const player = state.characters.find(_=>_.isPlayer)

    if (currentRoom) {
        if (hoverTarget.type === 'character' || hoverTarget.type === 'thing') {
            if (hoverTarget.room !== currentRoom.name) {
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

        const { currentRoomName, rooms } = state
        const currentRoom = rooms.find(_ => _.name === currentRoomName)
        const matchingInteraction = matchInteraction(command, currentRoom, state.interactions)

        if (matchingInteraction) {
            const execute = makeConsequenceExecutor(state, props)
            matchingInteraction.consequences.forEach(execute)
        } else {
            doDefaultResponse(command, state)
        }

        removeHoverTargetIfGone(state, currentRoom)

        return state
    }
}