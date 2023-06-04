import { createContext, useContext } from 'react'
import { GameState } from '.'
import { findById } from '@/lib/util'

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

export const useGameStateDerivations = () => {
    const gameState = useContext(gameStateContext)
    const { currentConversationId, conversations, endingId, sequenceRunning, items, currentItemId, actors } = gameState

    const player = actors.find(actor => actor.isPlayer)
    const inventory = items.filter(item => item.actorId === player?.id)

    return {
        isConversationRunning: !!findById(currentConversationId, conversations),
        isGameEnded: !!endingId,
        isSequenceRunning: !!sequenceRunning,
        currentItem: findById(currentItemId, items),
        player,
        inventory,
    }
}
