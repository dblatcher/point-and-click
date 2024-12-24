import { Reducer } from "react"
import { GameEditorState, GameDesignAction } from "./types"
import { cloneData } from "../clone"
import { addGameDataItem, changeOrAddInteraction } from "../mutate-design"
import { GameDesign } from "@/definitions"


const higherLevelAddHistoryItem =
    (history: GameEditorState['history'], gameDesign: GameDesign, maxLength = 10) =>
        (label: string) => {
            history.push({
                label,
                gameDesign
            })
            if (history.length > maxLength) { history.shift() }
            return history
        }

export const gameDesignReducer: Reducer<GameEditorState, GameDesignAction> = (gameEditorState, action) => {
    const addHistory = higherLevelAddHistoryItem(gameEditorState.history, cloneData(gameEditorState.gameDesign));
    switch (action.type) {
        case 'open-in-editor': {
            const { tabId, itemId } = action
            const { gameItemIds } = gameEditorState

            switch (tabId) {
                case 'rooms':
                case 'items':
                case 'actors':
                case 'conversations':
                case 'sprites':
                case 'sequences':
                case 'endings':
                case 'verbs':
                case 'storyBoards':
                    gameItemIds[tabId] = itemId
                    break;
            }
            return {
                ...gameEditorState,
                tabOpen: tabId,
                gameItemIds,
            }
        }

        case "modify-design": {
            const { description, mod } = action
            console.log(description)
            return {
                ...gameEditorState,
                history: addHistory(description),
                gameDesign: { ...gameEditorState.gameDesign, ...mod },
            }
        }

        case "undo": {
            const { history } = gameEditorState
            const last = history.pop();
            if (!last) {
                return gameEditorState
            }
            return {
                ...gameEditorState,
                history,
                gameDesign: last.gameDesign,
            }
        }

        case "load-new": {
            return {
                ...gameEditorState,
                gameDesign: action.gameDesign,
                history: [],
            }
        }

        case "create-data-item": {
            const { property, data } = action
            console.log(property, data)
            const { gameDesign } = gameEditorState;
            addGameDataItem(gameDesign, property, data)

            return {
                ...gameEditorState,
                gameDesign,
                history: addHistory(`add new ${property}: ${data.id}`)
            }
        }

        case "delete-data-item": {
            const { property, index } = action
            const { gameDesign } = gameEditorState
            // TO DO - check for references to the ID of the deleted item?
            const dataItemArray = gameDesign[property];
            if (!dataItemArray) {
                return gameEditorState;
            }
            const message = `delete "${dataItemArray[index]?.id}" from ${property}`;
            dataItemArray.splice(index, 1);

            return {
                ...gameEditorState,
                history: addHistory(message),
                gameDesign,
            }
        }

        case "change-or-add-interaction": {
            const { index, data } = action
            const { gameDesign } = gameEditorState
            return {
                ...gameEditorState,
                history: addHistory(`change interaction`),
                gameDesign: changeOrAddInteraction(gameDesign, data, index)
            }
        }

        case "delete-interaction": {
            const { index } = action
            const { gameDesign } = gameEditorState
            const interactionToDelete = gameDesign.interactions[index]
            if (!interactionToDelete) {
                return gameEditorState
            }
            const { verbId, targetId, itemId = '[no item]' } = interactionToDelete;
            gameDesign.interactions.splice(index, 1);
            return {
                ...gameEditorState,
                history: addHistory(`delete interaction #${index}: ${verbId} ${targetId} (${itemId})`),
                gameDesign,
            }
        }
    }
}
