import { FunctionComponent } from "react";
import { Zone, SupportedZoneShape } from "../../../definitions/Zone";
import { RoomEditorState } from ".";
import { icons } from "../dataEditors";
import { Entry, Folder, TreeMenu, EntryClickFunction, FolderClickFunction } from "../TreeMenu";
import { ClickEffect } from "./ClickEffect";


const buildFoldersFromRoomEditorState = (roomEditorState: RoomEditorState): Folder[] => {

    const {
        obstacleAreas = [], walkableAreas = [], hotspots = [], background = [],
        mainTab, clickEffect, walkableTab, obstableTab, hotspotTab
    } = roomEditorState

    const getShape = (zone: Zone): string => zone.polygon ? 'polygon' : zone.circle ? 'circle' : zone.rect ? 'rect' : '??';

    const newZoneEntryisActive = (clickEffectType: ClickEffect["type"], shape: SupportedZoneShape): boolean => {
        return clickEffect?.type === clickEffectType && 'shape' in clickEffect && clickEffect.shape === shape
    }

    const makeNewZoneEntries = (clickEffectType: ClickEffect["type"]): Entry[] => ([
        { label: `${icons.INSERT} circle`, isForNew: true, data: { id: 'circle' }, active: newZoneEntryisActive(clickEffectType, 'circle') },
        { label: `${icons.INSERT} rect`, isForNew: true, data: { id: 'rect' }, active: newZoneEntryisActive(clickEffectType, 'rect') },
        { label: `${icons.INSERT} polygon`, isForNew: true, data: { id: 'polygon' }, active: newZoneEntryisActive(clickEffectType, 'polygon') },
    ])

    const obstacleEntries: Entry[] = obstacleAreas.map((obstacle, index) => ({
        label: obstacle.ref || `#${index} ${getShape(obstacle)}`,
        data: {
            id: index.toString()
        },
        active: obstableTab === index,
    }))
    obstacleEntries.push(...makeNewZoneEntries('OBSTACLE'))

    const walkableEntries: Entry[] = walkableAreas.map((walkable, index) => ({
        label: walkable.ref || `#${index} ${getShape(walkable)}`,
        data: {
            id: index.toString()
        },
        active: walkableTab === index,
    }))
    walkableEntries.push(...makeNewZoneEntries('WALKABLE'))

    const hotspotEntries: Entry[] = hotspots.map((hotspot, index) => ({
        label: hotspot.id,
        data: hotspot,
        active: hotspotTab === index
    }))

    hotspotEntries.push(...makeNewZoneEntries('HOTSPOT'))

    return [
        {
            id: 'scaling',
            open: mainTab === 0,
        },
        {
            id: 'backgrounds',
            label: `backgrounds [${background.length}]`,
            open: mainTab === 1,
        },
        {
            id: 'OBSTACLE',
            label: `obstacles [${obstacleAreas.length}]`,
            open: mainTab === 2,
            entries: obstacleEntries
        },
        {
            id: 'WALKABLE',
            label: `walkables [${walkableAreas.length}]`,
            open: mainTab === 3,
            entries: walkableEntries
        },
        {
            id: 'HOTSPOT',
            label: `hotspots [${hotspots.length}]`,
            open: mainTab === 4,
            entries: hotspotEntries
        },
    ]

}


type Props = {
    roomEditorState: RoomEditorState;
    handleTreeEntryClick: EntryClickFunction;
    handleFolderClick: { (folderIndex: number): void };
}

export const RoomEditorTreeMenu: FunctionComponent<Props> = ({
    roomEditorState, handleTreeEntryClick, handleFolderClick
}) => {

    const folders = buildFoldersFromRoomEditorState(roomEditorState)

    const folderClickAndFindIndex: FolderClickFunction = (folderId) => {
        const folderIndex = folders.findIndex(folder => folder.id === folderId)
        handleFolderClick(folderIndex)
    }

    return <TreeMenu
        folders={folders}
        folderClick={folderClickAndFindIndex}
        entryClick={handleTreeEntryClick}
    />
}