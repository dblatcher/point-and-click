import { FlagMap, GameDataItem, GameDesign, Interaction, Verb } from "@/definitions";
import { findIndexById } from "../util";

function addNewOrUpdate<T extends GameDataItem>(newData: unknown, list: T[]): T[] {
    const newItem = newData as T;
    const matchIndex = findIndexById(newItem.id, list)
    if (matchIndex !== -1) {
        list.splice(matchIndex, 1, newItem)
    } else {
        list.push(newItem)
    }
    return list
}

export const mutateProperty = (gameDesign: GameDesign, property: keyof GameDesign, data: unknown) => {
    switch (property) {
        case 'rooms':
        case 'items':
        case 'actors':
        case 'conversations':
        case 'sprites':
        case 'sequences':
        case 'endings':
            {
                addNewOrUpdate(data, gameDesign[property] as GameDataItem[])
                break
            }
        case 'verbs':
            {
                if (Array.isArray(data)) {
                    gameDesign[property] = data as Verb[]
                } else {
                    addNewOrUpdate(data, gameDesign[property])
                }
                break
            }
        case 'interactions':
            {
                if (Array.isArray(data)) {
                    gameDesign.interactions = data as Interaction[]
                }
                break
            }
        case 'flagMap': {
            gameDesign.flagMap = (data as FlagMap)
            break
        }
        case 'id':
        case 'currentRoomId': {
            gameDesign[property] = data as string
            break
        }
        case 'openingSequenceId': {
            if (data === '' || typeof data === 'undefined') {
                gameDesign[property] = undefined
            } else {
                gameDesign[property] = data as string
            }
            break
        }
    }
    return gameDesign
}

export const changeOrAddIteration = (gameDesign: GameDesign, interaction: Interaction, index?: number) => {
    const { interactions } = gameDesign
    if (typeof index === 'undefined') {
        interactions.push(interaction)
    } else {
        interactions.splice(index, 1, interaction)
    }
    return gameDesign
}
