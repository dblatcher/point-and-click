import { GameProps } from '@/components/game/types'
import { GameState } from '@/lib/game-state-logic/types'
import { DB_VERSION } from '@/lib/indexed-db'
import { CELL_SIZE, DEFAULT_TALK_TIME, XY } from '@/lib/types-and-constants'
import { findById } from '@/lib/util'
import { createContext, useContext } from 'react'
import { GameEventEmitter } from '../lib/game-event-emitter'
import { ActionWithoutProp, GameStateAction } from '@/lib/game-state-logic/game-state-actions'

const gameStateContext = createContext<{
    gameState: GameState,
    updateGameState: { (action: GameStateAction | ActionWithoutProp): void },
    gameProps: Readonly<GameProps>,
}>(
    {
        gameState: {
            viewAngleX: 0,
            viewAngleY: 0,
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
            schemaVersion: DB_VERSION,
            playSound: () => false,
            id: '',
            rooms: [],
            items: [],
            actors: [],
            interactions: [],
            conversations: [],
            storyBoards: [],
            flagMap: {},
            currentRoomId: '',
            verbs: [],
            sequences: [],
            sprites: [],
            cellSize: CELL_SIZE,
            defaultTalkTime: DEFAULT_TALK_TIME,
        }
    }
)

export const GameStateProvider = gameStateContext.Provider

export const useGameState = () => {
    return useContext(gameStateContext)
}

export const useGameStateDerivations = () => {
    const { gameState, gameProps } = useContext(gameStateContext)
    const { currentStoryBoardId, currentConversationId, conversations, sequenceRunning, items, currentItemId, actors } = gameState

    const player = actors.find(actor => actor.isPlayer)
    const inventory = items.filter(item => item.actorId === player?.id)
    const currentConversation = findById(currentConversationId, conversations)
    const verb = findById(gameState.currentVerbId, gameProps.verbs);
    const lookVerb = gameProps.verbs.find(verb => verb.isLookVerb) ?? gameProps.verbs.find(verb => verb.id === 'LOOK');
    const moveVerb = gameProps.verbs.find(verb => verb.isMoveVerb) ?? gameProps.verbs.find(verb => verb.id === 'WALK');

    return {
        currentConversation,
        isConversationRunning: !!currentConversation,
        currentStoryBoard: findById(currentStoryBoardId, gameProps.storyBoards),
        isSequenceRunning: !!sequenceRunning,
        currentItem: findById(currentItemId, items),
        player,
        inventory,
        verb,
        lookVerb,
        moveVerb,
    }
}
