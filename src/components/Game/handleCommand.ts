import { GameState } from ".";
import { Command } from "../../definitions/Command";
import { Interaction } from "../../definitions/Interaction";
import { Order } from "../../definitions/Order";
import { RoomData } from "../../definitions/RoomData";
import { changeRoom } from "./changeRoom";

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

        const { currentRoomName, rooms, characters, items } = state
        const currentRoom = rooms.find(_ => _.name === currentRoomName)
        const matchingInteraction = matchInteraction(command, currentRoom, state.interactions)

        if (matchingInteraction) {
            const player = characters.find(_ => _.isPlayer)

            const getCharacter = (characterId?: string) => characterId ? characters.find(_ => _.id === characterId) : player

            matchingInteraction.consequences.forEach(consequence => {

                switch (consequence.type) {
                    case 'order': {
                        const { characterId, orders } = consequence
                        const character = getCharacter(characterId)
                        if (!character) { return }
                        const clonedOrders = JSON.parse(JSON.stringify(orders)) as Order[]
                        if (consequence.replaceCurrentOrders) {
                            character.orders = clonedOrders
                        } else {
                            character.orders.push(...clonedOrders)
                        }
                        break;
                    }
                    case 'talk': {
                        const { characterId, text, time=100 } = consequence
                        const character = getCharacter(characterId)
                        if (!character) { return }

                        character.orders.push({
                            type: 'talk',
                            steps: [{ text, time }]
                        })
                        break;
                    }
                    case 'changeRoom': {
                        const { roomId, takePlayer, point } = consequence;
                        const modificationFunction = changeRoom(roomId, takePlayer, point)
                        Object.assign(state, modificationFunction(state))
                        break;
                    }
                    case 'inventory': {
                        const { characterId, itemId, addOrRemove } = consequence
                        const character = getCharacter(characterId)
                        const item = items.find(_ => _.id === itemId)
                        if (!character || !item) { return }

                        if (addOrRemove === 'ADD') {
                            item.characterId = character.id

                        } else if (item.characterId === character.id) {
                            item.characterId = undefined
                        }
                    }
                }
            })
        } else {
            state = doDefaultResponse(command, state)
        }

        return state
    }
}