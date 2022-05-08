import { GameProps, GameState } from "."
import { CommandTarget } from "../../definitions/Command"
import { Consequence } from "../../definitions/Interaction"
import { Order } from "../../definitions/Order"
import { cloneData } from "../../lib/clone"
import { changeRoom } from "./changeRoom"



export const makeConsequenceExecutor = (state: GameState, props: GameProps) => {

    const { characters, items, things, rooms, currentRoomName, characterOrders, } = state
    const player = characters.find(_ => _.isPlayer)
    const getCharacter = (characterId?: string) => characterId ? characters.find(_ => _.id === characterId) : player
    const currentRoom = rooms.find(_ => _.name === currentRoomName)

    return (consequence: Consequence) => {

        switch (consequence.type) {
            case 'order': {
                const { characterId, orders } = consequence
                const character = getCharacter(characterId)
                if (!character) { return }
                const clonedOrders = JSON.parse(JSON.stringify(orders)) as Order[]

                if (consequence.replaceCurrentOrders) {
                    characterOrders[character.id] = clonedOrders
                } else if (characterOrders[character.id]) {
                    characterOrders[character.id].push(...clonedOrders)
                } else {
                    characterOrders[character.id] = clonedOrders
                }

                break;
            }
            case 'talk': {
                const { characterId, text, time = 100 } = consequence
                const character = getCharacter(characterId)
                if (!character) { return }

                if (!characterOrders[character.id]) {
                    characterOrders[character.id] = []
                }
                characterOrders[character.id].push({
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
            case 'changeStatus': {
                const { targetId, targetType, status } = consequence
                let target: CommandTarget;
                switch (targetType) {
                    case 'character':
                        target = characters.find(_ => _.id === targetId);
                        break;
                    case 'item':
                        target = items.find(_ => _.id === targetId);
                        break;
                    case 'thing':
                        target = things.find(_ => _.id === targetId);
                        break;
                    case 'hotspot':
                        target = currentRoom?.hotspots?.find(_ => _.id === targetId)
                        break;
                }

                if (target) {
                    target.status = status
                }
                break;
            }
            case 'sequence': {
                const { sequence } = consequence
                const [, originalSequence] = Object.entries(props.sequences).find(_ => _[0] === sequence)
                if (originalSequence) {
                    state.sequenceRunning = cloneData(originalSequence)
                } else {
                    console.warn(`No such sequence ${sequence}`)
                }
                break;
            }
        }
    }
}
