import { createContext, useContext } from 'react'
import { GameState } from '@/lib/game-state-logic/types'
import { findById } from '@/lib/util'
import { GameEventEmitter } from '../lib/game-event-emitter'
import { ActionWithoutProp, GameStateAction } from '@/lib/game-state-logic/game-state-reducer'
import { GameProps } from '@/components/game/types'
import { SoundService } from '@/services/soundService'
import { DB_VERSION } from '@/lib/indexed-db'

const gameStateContext = createContext<{
    gameState: GameState,
    updateGameState: { (action: GameStateAction | ActionWithoutProp): void },
    gameProps: Readonly<GameProps>,
}>(
    {
        gameState: {
            viewAngle: 0,
            schemaVersion: DB_VERSION,
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
            schemaVersion: DB_VERSION,
            soundService: new SoundService,
            id: '',
            rooms: [],
            items: [],
            actors: [],
            interactions: [],
            conversations: [],
            storyBoards: [],
            flagMap: {},
            currentRoomId: '',
            actorOrders: {},
            gameNotBegun: false,
            verbs: [],
            sequences: [],
            sprites: [],
        }
    }
)

export const GameStateProvider = gameStateContext.Provider

export const useGameState = () => {
    return useContext(gameStateContext)
}

export const useGameStateDerivations = () => {
    const { gameState, gameProps } = useContext(gameStateContext)
    const { currentConversationId, conversations, sequenceRunning, items, currentItemId, actors } = gameState

    const player = actors.find(actor => actor.isPlayer)
    const inventory = items.filter(item => item.actorId === player?.id)
    const currentConversation = findById(currentConversationId, conversations)
    const verb = findById(gameState.currentVerbId, gameProps.verbs);
    const lookVerb = gameProps.verbs.find(verb => verb.isLookVerb) ?? gameProps.verbs.find(verb => verb.id === 'LOOK');
    const moveVerb = gameProps.verbs.find(verb => verb.isMoveVerb) ?? gameProps.verbs.find(verb => verb.id === 'WALK');

    return {
        currentConversation,
        isConversationRunning: !!currentConversation,
        isGameEnded: false, //  TO DO - see if this is valuable, if so derive from storyboard
        isSequenceRunning: !!sequenceRunning,
        currentItem: findById(currentItemId, items),
        player,
        inventory,
        verb,
        lookVerb,
        moveVerb,
    }
}
