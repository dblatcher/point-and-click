import { Reducer } from "react"
import { GameEditorState, GameDesignAction } from "./types"
import { cloneData } from "../clone"
import { addGameDataItem } from "../mutate-design"

export const gameDesignReducer: Reducer<GameEditorState, GameDesignAction> = (gameEditorState, action) => {
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
                gameDesign: { ...gameEditorState.gameDesign, ...mod },
                history: [...gameEditorState.history, { gameDesign: cloneData(gameEditorState.gameDesign), label: description }]
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
            const { gameDesign, history } = gameEditorState
            const historyItem = {
                gameDesign: cloneData(gameDesign),
                label: `add new ${property}: ${data.id}`
            }
            addGameDataItem(gameDesign, property, data)

            return {
                ...gameEditorState,
                gameDesign,
                history: [...history, historyItem]
            }
        }
    }
}
