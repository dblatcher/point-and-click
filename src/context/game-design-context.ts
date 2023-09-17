import { createContext, useContext } from 'react'
import { GameDesign } from '@/definitions'
import { EditorOptions } from '../components/GameEditor'

const gameDesignContext = createContext<{
    gameDesign: GameDesign,
    performUpdate: { (property: keyof GameDesign, data: unknown): void },
    deleteArrayItem: { (index: number, property: keyof GameDesign): void },
    options: EditorOptions,
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
        performUpdate: () => { },
        deleteArrayItem: () => { },
        options: {
            autoSave: false
        }
    }
)

export const GameDesignProvider = gameDesignContext.Provider

export const useGameDesign = () => {
    return useContext(gameDesignContext)
}
