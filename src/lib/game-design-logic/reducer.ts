import { Reducer } from "react"
import { GameEditorState, GameDesignAction } from "./types"
import { cloneData } from "../clone"
import { addGameDataItem, putInteraction } from "./mutate-design"
import { GameDesign } from "@/definitions"
import { setQuitSave } from "../indexed-db"


const higherLevelAddHistoryItem =
    (history: GameEditorState['history'], gameDesign: GameDesign, maxLength = 10) =>
        (label: string): Pick<GameEditorState, 'history' | 'undoneHistory'> => {
            history.push({
                label,
                gameDesign
            })
            if (history.length > maxLength) { history.shift() }
            return { history, undoneHistory: [] }
        }

export const gameDesignReducer: Reducer<GameEditorState, GameDesignAction> = (gameEditorState, action) => {
    const addHistory = higherLevelAddHistoryItem(gameEditorState.history, cloneData(gameEditorState.gameDesign));

    const saveToQuitSave = (gameEditorState: GameEditorState) => {
        const { db, gameDesign } = gameEditorState
        if (db) {
            setQuitSave(db)(gameDesign)
        }
        return gameEditorState
    }

    switch (action.type) {
        case "set-db-instance":
            const { db } = action
            return {
                ...gameEditorState,
                db
            }

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

            return saveToQuitSave({
                ...gameEditorState,
                ...addHistory(description),
                gameDesign: { ...gameEditorState.gameDesign, ...mod },
            })
        }

        case "undo": {
            const { history, undoneHistory, gameDesign } = gameEditorState
            const last = history.pop();
            if (!last) {
                return gameEditorState
            }
            return saveToQuitSave({
                ...gameEditorState,
                history,
                undoneHistory: [...undoneHistory, { label: last.label, gameDesign }],
                gameDesign: cloneData(last.gameDesign),
            })
        }

        case "redo": {
            const { history, undoneHistory, gameDesign } = gameEditorState
            const last = undoneHistory.pop();
            if (!last) {
                return gameEditorState
            }
            return saveToQuitSave({
                ...gameEditorState,
                history: [...history, { label: last.label, gameDesign }],
                undoneHistory,
                gameDesign: cloneData(last.gameDesign),
            })
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
            const { gameDesign } = gameEditorState;
            addGameDataItem(gameDesign, property, data)

            return saveToQuitSave({
                ...gameEditorState,
                gameDesign,
                ...addHistory(`add new ${property}: ${data.id}`)
            })
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

            return saveToQuitSave({
                ...gameEditorState,
                ...addHistory(message),
                gameDesign,
            })
        }

        case "change-or-add-interaction": {
            const { index, data } = action
            const { gameDesign } = gameEditorState
            return saveToQuitSave({
                ...gameEditorState,
                ...addHistory(`change interaction`),
                gameDesign: putInteraction(gameDesign, data, index)
            })
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
            return saveToQuitSave({
                ...gameEditorState,
                ...addHistory(`delete interaction #${index}: ${verbId} ${targetId} (${itemId})`),
                gameDesign,
            })
        }
    }
}
