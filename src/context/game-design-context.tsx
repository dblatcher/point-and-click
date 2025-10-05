import { GameDesign, Interaction, RoomData } from '@/definitions'
import { GameDataItem, GameDataItemType } from '@/definitions/Game'
import { TabId } from '@/lib/editor-config'
import { DesignUpgradeInfo, GameDesignAction } from '@/lib/game-design-logic/types'
import { DB_VERSION, MaybeDesignAndAssets } from '@/lib/indexed-db'
import { patchMember } from '@/lib/update-design'
import { UpdateSource } from '@/services/FileAssetService'
import { createContext, ReactNode, useContext } from 'react'


type GameDesignContextInputs = {
    gameDesign: GameDesign,
    tabOpen: TabId,
    gameItemIds: Partial<Record<GameDataItemType, string>>,
    upgradeInfo?: DesignUpgradeInfo
    dispatchDesignUpdate: { (value: GameDesignAction): void },
    handleIncomingDesign: { (sourceIdentifier: string, designAndAssets: MaybeDesignAndAssets, updateSource: UpdateSource): boolean },
}

type GameDesignContextProps = GameDesignContextInputs & {
    openInEditor: { (itemType: TabId, itemId?: string | undefined): void }
    applyModification: { (description: string, mod: Partial<GameDesign>): void },
    createGameDataItem: { (property: GameDataItemType, data: GameDataItem): void },
    deleteArrayItem: { (index: number, property: GameDataItemType): void },
    changeOrAddInteraction: { (data: Interaction, index?: number): void },
    deleteInteraction: { (index: number): void }
    modifyRoom: { (description: string, id: string, mod: Partial<RoomData>): void }
}

const GameDesignContext = createContext<GameDesignContextProps>(
    {
        gameDesign: {
            id: '',
            schemaVersion: DB_VERSION,
            currentRoomId: '',
            actors: [],
            rooms: [],
            interactions: [],
            items: [],
            conversations: [],
            flagMap: {},
            verbs: [],
            sequences: [],
            sprites: [],
            storyBoards: []
        },
        tabOpen: 'main',
        gameItemIds: {},
        dispatchDesignUpdate: () => { },
        handleIncomingDesign: () => false,
        createGameDataItem: () => { },
        deleteArrayItem: () => { },
        openInEditor: () => { },
        changeOrAddInteraction: () => { },
        deleteInteraction: () => { },
        applyModification: () => { },
        modifyRoom: () => { },
    }
)

export const GameDesignProvider = ({
    children,
    input,
}: {
    children: ReactNode
    input: GameDesignContextInputs
}) => {

    const { dispatchDesignUpdate, gameDesign } = input

    const value: GameDesignContextProps = {
        ...input,
        openInEditor: (tabId: TabId, itemId?: string) => dispatchDesignUpdate({ type: 'open-in-editor', itemId, tabId }),
        applyModification: (description, mod) => dispatchDesignUpdate({ type: 'modify-design', description, mod }),
        createGameDataItem: (property, data) => dispatchDesignUpdate({ type: 'create-data-item', property, data }),
        deleteArrayItem: (index, property) => dispatchDesignUpdate({ type: 'delete-data-item', index, property }),
        changeOrAddInteraction: (data, index) => dispatchDesignUpdate({ type: 'change-or-add-interaction', index, data }),
        deleteInteraction: (index) => dispatchDesignUpdate({ type: 'delete-interaction', index }),
        modifyRoom: (description, id, mod) => dispatchDesignUpdate({ type: 'modify-design', description, mod: { rooms: patchMember(id, mod, gameDesign.rooms) } }),
    }

    return (
        <GameDesignContext.Provider value={value}>{children}</GameDesignContext.Provider>
    )
}

export const useGameDesign = () => {
    return useContext(GameDesignContext)
}
