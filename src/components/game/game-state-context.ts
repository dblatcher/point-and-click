import { createContext, useContext } from 'react'
import { GameState } from '.'

const gameStateContext = createContext<GameState>(
    {
        viewAngle: 0,
        isPaused: false,
        id: '',
        currentRoomId: '',
        actors: [],
        rooms: [],
        currentVerbId: '',
        interactions: [],
        items: [],
        sequenceRunning: undefined,
        actorOrders: {},
        conversations: [],
        currentConversationId: '',
        debugLog: [],
        flagMap: {},
        gameNotBegun: false,
    }
)

export const GameStateProvider = gameStateContext.Provider

export const useGameState = () => {
    return useContext(gameStateContext)
}