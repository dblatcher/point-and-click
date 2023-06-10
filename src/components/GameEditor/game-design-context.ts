import { createContext, useContext } from 'react'
import { GameDesign } from '@/definitions'

const gameDesignContext = createContext<{ 
    gameDesign: GameDesign, 
    performUpdate: { (property: keyof GameDesign, data: unknown): void } 
}>(
    {
        gameDesign: {
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
        },
        performUpdate: () => { }
    }
)

export const GameDesignProvider = gameDesignContext.Provider

export const useGameDesign = () => {
    return useContext(gameDesignContext)
}
