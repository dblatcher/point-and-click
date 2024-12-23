import { Reducer } from "react"
import { GameEditorState, GameDesignAction } from "./types"

export const gameDesignReducer: Reducer<GameEditorState, GameDesignAction> = (gameEditorState, action) => {
    switch (action.type) {
        case 'open-in-editor' : {
            const {tabId, itemId} = action
            const {gameItemIds} = gameEditorState

            if (itemId) {
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
            }

            return {
                ...gameEditorState,
                tabOpen: tabId,
                gameItemIds,
            }
        }
    }
    return gameEditorState
}
