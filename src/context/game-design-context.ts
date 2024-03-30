import { createContext, useContext } from 'react'
import { GameDesign } from '@/definitions'
import { TabId } from '@/lib/editor-config'

const gameDesignContext = createContext<{
    gameDesign: GameDesign,
    performUpdate: { (property: keyof GameDesign, data: unknown): void },
    deleteArrayItem: { (index: number, property: keyof GameDesign): void },
    openInEditor: { (itemType: TabId, itemId: string | undefined): void }
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
        openInEditor: () => { },
    }
)

export const GameDesignProvider = gameDesignContext.Provider

export const useGameDesign = () => {
    return useContext(gameDesignContext)
}
