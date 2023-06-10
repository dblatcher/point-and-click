import { createContext, useContext } from 'react'
import { GameDesign } from '@/definitions'

const gameDesignContext = createContext<GameDesign>(
    {
        id: '',
        currentRoomId: '',
        actors: [],
        rooms: [],
        interactions: [],
        items: [],
        conversations: [],
        flagMap: {},
        verbs: [],
        sequences: [],
        endings: [],
        sprites: [],
    }
)

export const GameDesignProvider = gameDesignContext.Provider

export const useGameDesign = () => {
    return useContext(gameDesignContext)
}
