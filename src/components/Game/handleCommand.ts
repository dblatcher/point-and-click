import { GameState } from ".";
import { Command } from "../../definitions/Command";
import { Interaction } from "../../definitions/Interaction";
import { RoomData } from "../../definitions/RoomData";
import { makeConsequenceExecutor } from "./executeConsequence";

function matchInteraction(
    command: Command,
    room: RoomData,
    interactions: Interaction[]
): Interaction | undefined {
    const { verb, item, target } = command
    return interactions.find(interaction => {
        return interaction.verbId === verb.id
            && interaction.targetId === target.id
            && (!interaction.roomId || interaction?.roomId === room.name)
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
        ? `I can\'t ${verb.label} the ${item.name || item.id} ${verb.preposition} the ${target.name || target.id}`
        : `Nothing happens when I ${verb.label} the ${target.name || target.id}`;

    state.characterOrders[player.id].push({
        type: 'talk',
        steps: [{ text, time: 100 }]
    })

    return state
}

export function handleCommand(command: Command): { (state: GameState): Partial<GameState> } {

    return (state) => {

        const { currentRoomName, rooms } = state
        const currentRoom = rooms.find(_ => _.name === currentRoomName)
        const matchingInteraction = matchInteraction(command, currentRoom, state.interactions)

        if (matchingInteraction) {
            const execute = makeConsequenceExecutor(state)
            matchingInteraction.consequences.forEach(execute)
        } else {
            doDefaultResponse(command, state)
        }

        return state
    }
}