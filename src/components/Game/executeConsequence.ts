import { GameState } from "."
import { Consequence } from "../../definitions/Interaction"
import { Order } from "../../definitions/Order"
import { changeRoom } from "./changeRoom"

export const makeConsequenceExecutor = (state: GameState) => {

    const { characters, items, things } = state
    const player = characters.find(_ => _.isPlayer)
    const getCharacter = (characterId?: string) => characterId ? characters.find(_ => _.id === characterId) : player

    return (consequence: Consequence) => {

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
                const { characterId, text, time = 100 } = consequence
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
                break;
            }
            case 'removeThing': {
                const { thingId } = consequence
                const thing = things.find(_ => _.id === thingId)
                if (!thing) { return }
                thing.room = undefined;
                break;
            }
        }
    }
}