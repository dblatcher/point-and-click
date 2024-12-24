import { GameDesign, Interaction, RoomData } from '@/definitions'
import { GameDataItem, GameDataItemType } from '@/definitions/Game'
import { TabId } from '@/lib/editor-config'
import { createContext, useContext } from 'react'

const gameDesignContext = createContext<{
    gameDesign: GameDesign,
    openInEditor: { (itemType: TabId, itemId: string | undefined): void }
    applyModification: { (description: string, mod: Partial<GameDesign>): void },
    createGameDataItem: { (property: GameDataItemType, data: GameDataItem): void },
    deleteArrayItem: { (index: number, property: GameDataItemType): void },
    changeOrAddInteraction: { (data: Interaction, index?: number): void },
    deleteInteraction: { (index: number): void }
    modifyRoom: { (description: string, id: string, mod: Partial<RoomData>): void }
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
        createGameDataItem: () => { },
        deleteArrayItem: () => { },
        openInEditor: () => { },
        changeOrAddInteraction: () => { },
        deleteInteraction: () => { },
        applyModification: () => { },
        modifyRoom: () => { },
    }
)

export const GameDesignProvider = gameDesignContext.Provider

export const useGameDesign = () => {
    return useContext(gameDesignContext)
}
