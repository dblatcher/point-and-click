import { Reducer } from "react"
import { GameEditorState, GameDesignAction } from "./types"
import { cloneData } from "../clone"
import { addGameDataItem } from "../mutate-design"
import { GameDesign } from "@/definitions"


const higherLevelAddHistoryItem =
    (history: GameEditorState['history'], maxLength = 10) =>
        (label: string, gameDesign: GameDesign) => {
            history.push({
                label,
                gameDesign: cloneData(gameDesign)
            })
            if (history.length > maxLength) { history.shift() }
            return history
        }

export const gameDesignReducer: Reducer<GameEditorState, GameDesignAction> = (gameEditorState, action) => {
    const addHistory = higherLevelAddHistoryItem(gameEditorState.history);
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
                history: addHistory(description, gameEditorState.gameDesign),
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
            const oldData = cloneData(gameDesign);
            addGameDataItem(gameDesign, property, data)

            return {
                ...gameEditorState,
                gameDesign,
                history: addHistory(`add new ${property}: ${data.id}`, oldData)
            }
        }
    }
}
