import { createContext, useContext } from 'react'
import { GameState } from '@/lib/game-state-logic/types'
import { findById } from '@/lib/util'
import { GameEventEmitter } from '../lib/game-event-emitter'
import { ActionWithoutProp, GameStateAction } from '@/lib/game-state-logic/game-state-reducer'
import { GameProps } from '@/components/game/types'
import { SoundService } from '@/services/soundService'

const gameStateContext = createContext<{
    gameState: GameState,
    updateGameState: { (action: GameStateAction | ActionWithoutProp): void },
    gameProps: Readonly<GameProps>,
}>(
    {
        gameState: {
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
        },
        updateGameState: () => { },
        gameProps: {
            _sprites: [],
            soundService: new SoundService,
            id: '',
            rooms: [],
            items: [],
            actors: [],
            interactions: [],
            conversations: [],
            flagMap: {},
            currentRoomId: '',
            actorOrders: {},
            gameNotBegun: false,
            verbs: [],
            sequences: [],
            sprites: [],
            endings: []
        }
    }
)

export const GameStateProvider = gameStateContext.Provider

export const useGameState = () => {
    return useContext(gameStateContext)
}

export const useGameStateDerivations = () => {
    const { gameState, gameProps } = useContext(gameStateContext)
    const { currentConversationId, conversations, endingId, sequenceRunning, items, currentItemId, actors } = gameState

    const player = actors.find(actor => actor.isPlayer)
    const inventory = items.filter(item => item.actorId === player?.id)
    const currentConversation = findById(currentConversationId, conversations)
    const verb = findById(gameState.currentVerbId, gameProps.verbs);
    const ending = findById(gameState.endingId, gameProps.endings)
    const lookVerb = gameProps.verbs.find(verb => verb.isLookVerb) ?? gameProps.verbs.find(verb => verb.id === 'LOOK');
    const moveVerb = gameProps.verbs.find(verb => verb.isMoveVerb) ?? gameProps.verbs.find(verb => verb.id === 'WALK');

    return {
        currentConversation,
        isConversationRunning: !!currentConversation,
        isGameEnded: !!endingId,
        isSequenceRunning: !!sequenceRunning,
        currentItem: findById(currentItemId, items),
        player,
        inventory,
        verb,
        ending,
        lookVerb,
        moveVerb,
    }
}
