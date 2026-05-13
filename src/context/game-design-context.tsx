import { makeBlankInteraction } from '@/components/GameEditor/defaults';
import { TabId } from '@/lib/editor-config';
import { DesignUpgradeInfo, GameDesignAction } from '@/lib/game-design-logic/types';
import { DB_VERSION, MaybeDesignAndAssets } from '@/lib/indexed-db';
import { patchMember } from '@/lib/update-design';
import { UpdateSource } from '@/services/FileAssetService';
import { GameDataItem, GameDataItemType, GameDesign, Interaction, RoomData } from "point-click-lib";
import { createContext, ReactNode, useCallback, useContext } from 'react';

type GameDesignContextInputs = {
    gameDesign: GameDesign,
    tabOpen: TabId,
    gameItemIds: Partial<Record<GameDataItemType, string>>,
    interactionIndex: number | undefined,
    upgradeInfo?: DesignUpgradeInfo
    history: { gameDesign: GameDesign; label: string }[];
    undoneHistory: { gameDesign: GameDesign; label: string }[];
    dispatchDesignUpdate: { (value: GameDesignAction): void },
    handleIncomingDesign: { (sourceIdentifier: string, designAndAssets: MaybeDesignAndAssets, updateSource: UpdateSource): boolean },
}

export type GameDesignContextProps = GameDesignContextInputs & {
    openInEditor: { (itemType: TabId, itemId?: string | undefined, interactionIndex?: number): void }
    applyModification: { (description: string, mod: Partial<GameDesign>): void },
    createGameDataItem: { (property: GameDataItemType, data: GameDataItem): void },
    deleteArrayItem: { (index: number, property: GameDataItemType): void },
    deleteInteraction: { (index: number): void }
    modifyRoom: { (description: string, id: string, mod: Partial<RoomData>): void }
    getInteractionClone: { (index?: number): Interaction }
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
        interactionIndex: undefined,
        dispatchDesignUpdate: () => { },
        handleIncomingDesign: () => false,
        createGameDataItem: () => { },
        deleteArrayItem: () => { },
        openInEditor: () => { },
        deleteInteraction: () => { },
        applyModification: () => { },
        modifyRoom: () => { },
        getInteractionClone: () => makeBlankInteraction(),
        history: [],
        undoneHistory: []
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

    const getInteractionClone = useCallback((index?: number): Interaction => {
        const original = typeof index === 'number' ? gameDesign.interactions[index] : undefined;
        return original
            ? structuredClone({ ...original, consequences: original.consequences ?? [] })
            : makeBlankInteraction()
    }, [gameDesign.interactions])

    const value: GameDesignContextProps = {
        ...input,
        openInEditor: (tabId: TabId, itemId?: string, interactionIndex?: number) => dispatchDesignUpdate({ type: 'open-in-editor', itemId, tabId, interactionIndex }),
        applyModification: (description, mod) => dispatchDesignUpdate({ type: 'modify-design', description, mod }),
        createGameDataItem: (property, data) => dispatchDesignUpdate({ type: 'create-data-item', property, data }),
        deleteArrayItem: (index, property) => dispatchDesignUpdate({ type: 'delete-data-item', index, property }),
        deleteInteraction: (index) => dispatchDesignUpdate({ type: 'delete-interaction', index }),
        modifyRoom: (description, id, mod) => dispatchDesignUpdate({ type: 'modify-design', description, mod: { rooms: patchMember(id, mod, gameDesign.rooms) } }),
        getInteractionClone,
    }

    return (
        <GameDesignContext.Provider value={value}>{children}</GameDesignContext.Provider>
    )
}

export const useGameDesign = () => {
    return useContext(GameDesignContext)
}
