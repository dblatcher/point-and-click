import { GameState } from ".";
import { Command } from "../../lib/Command";
import { Interaction } from "../../lib/Interaction";
import { RoomData } from "../../lib/RoomData";
import { changeRoom } from "./changeRoom";

function matchInteraction(
    command: Command, 
    room: RoomData, 
    interactions: Interaction[]
): Interaction | undefined {

    return interactions.find( interaction => {
        return interaction.verbId === command.verb.id
        && interaction.targetId === command.target.id
        && (!interaction.roomId || interaction?.roomId === room.name)
        && ((!interaction.itemId && !command.item) || (interaction?.itemId == command.item?.id))
    })
}

export function handleCommand(command: Command): { (state: GameState): Partial<GameState> } {

    return (state) => {

        const { currentRoomName, rooms } = state
        const currentRoom = rooms.find(_ => _.name === currentRoomName)

        const matchingInteraction = matchInteraction(command, currentRoom, state.interactions)
        console.log({matchingInteraction})

        if (command.target.type === 'hotspot') {

            if (command.target.id === 'bush') {
                const modificationFunction = changeRoom('test-room-2', true, { y: 5, x: 100 })
                Object.assign(state, modificationFunction(state))
            } else if (command.target.id === 'window') {
                const modificationFunction = changeRoom('OUTSIDE', true, { y: 12, x: 200 })
                Object.assign(state, modificationFunction(state))
            } else {
                const player = state.characters.find(_ => _.isPlayer)
                if (player) {
                    player.orders.push({
                        type: 'talk',
                        steps: [
                            { text: `You want to ${command.verb.label} the ${command.target.name}`, time: 150 },
                            { text: `Yayy!`, time: 125 },
                        ]
                    })
                }
            }
        }

        if (command.target.type === 'character') {
            if (command.verb.id === 'TALK') {
                const player = state.characters.find(_ => _.isPlayer)
                const otherCharacter = state.characters.find(_ => _.id == command.target.id)

                if (player && otherCharacter) {
                    player.orders.push({
                        type: 'talk',
                        steps: [
                            { text: `Hello, ${otherCharacter.name}!`, time: 150 },
                        ]
                    })
                    otherCharacter.orders.push({
                        type: 'talk',
                        steps: [
                            { text: `Hello to you too, ${player.name}!`, time: 150 },
                        ]
                    })
                }
            }
        }

        return state
    }
}