import { createContext, useContext } from 'react'
import { GameState } from '@/lib/game-state-logic/types'
import { findById } from '@/lib/util'
import { GameEventEmitter } from '../lib/game-event-emitter'

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
        flagMap: {},
        gameNotBegun: false,
        roomHeight: 400,
        roomWidth: 800,
        emitter: new GameEventEmitter(),
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
    const currentConversation = findById(currentConversationId, conversations)

    return {
        currentConversation,
        isConversationRunning: !!currentConversation,
        isGameEnded: !!endingId,
        isSequenceRunning: !!sequenceRunning,
        currentItem: findById(currentItemId, items),
        player,
        inventory,
    }
}
