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

    return interactions.find(interaction => {
        return interaction.verbId === command.verb.id
            && interaction.targetId === command.target.id
            && (!interaction.roomId || interaction?.roomId === room.name)
            && ((!interaction.itemId && !command.item) || (interaction?.itemId == command.item?.id))
    })
}

function doDefaultResponse(command: Command, state: GameState): GameState {
    const { characters } = state
    const player = characters.find(_ => _.isPlayer)
    if (!player) { return state }

    player.orders.push({
        type: 'talk',
        steps: [{
            text: `Nothing happens when you ${command.verb.label} the ${command.target.name || command.target.id}`,
            time: 100
        }]
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