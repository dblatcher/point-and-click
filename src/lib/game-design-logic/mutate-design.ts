import { GameDataItem, GameDesign, Interaction } from "point-click-lib";
import { GameDataItemType } from "point-click-lib";
import { findIndexById } from "../util";

const addNewOrUpdate = <T extends GameDataItem>(newItem: T, list: T[]): T[] => {
    const matchIndex = findIndexById(newItem.id, list)
    if (matchIndex !== -1) {
        list.splice(matchIndex, 1, newItem)
    } else {
        list.push(newItem)
    }
    return list
}

export const addGameDataItem = (gameDesign: GameDesign, property: GameDataItemType, data: GameDataItem) => {
    if (!gameDesign[property]) {
        gameDesign[property] = []
    }

    addNewOrUpdate(data, gameDesign[property])
    return gameDesign
}

export const putInteraction = (gameDesign: GameDesign, interaction: Interaction, index?: number) => {
    const { interactions } = gameDesign
    if (typeof index === 'undefined') {
        interactions.push(interaction)
    } else {
        interactions.splice(index, 1, interaction)
    }
    return gameDesign
}
