import { useGameDesign } from "@/context/game-design-context"
import { HotspotZone, RoomData, Zone, ZoneType } from "@/definitions"
import { cloneData } from "@/lib/clone"
import { useState } from "react"
import { ClickEffect, RoomClickContext } from "../ClickEffect"
import { LayoutControls, LayoutHolder, LayoutPreview } from "../Layout"
import { Preview } from "../Preview"
import { HotspotSetEditor } from "./HotspotSetEditor"
import { ZoneSetEditor } from "./ZoneSetEditor"
import { getChangesFromClick, getNextClickEffect } from "./lib"

interface Props {
    room: RoomData;
    zoneType: ZoneType
}

export const ZoneFeaturesControl = ({
    room, zoneType
}: Props) => {

    const [clickEffect, setClickEffect] = useState<ClickEffect | undefined>(undefined)
    const { gameDesign, modifyRoom } = useGameDesign()
    const [activeHotspotIndex, setActiveHotspotIndex] = useState<number | undefined>(0);
    const [activeObstacleIndex, setActiveObstacleIndex] = useState<number | undefined>(0);
    const [activeWalkableIndex, setActiveWalkableIndex] = useState<number | undefined>(0);

    const removeZone = (index: number, type: 'hotspot' | 'obstacle' | 'walkable') => {
        const { obstacleAreas = [], hotspots = [], walkableAreas = [] } = cloneData(room)
        switch (type) {
            case 'hotspot':
                hotspots.splice(index, 1)
                break;
            case 'obstacle':
                obstacleAreas.splice(index, 1)
                break;
            case 'walkable':
                walkableAreas.splice(index, 1)
                break;
        }
        modifyRoom(`remove ${type} from room ${room.id}`, room.id, { obstacleAreas, hotspots, walkableAreas })
    }

    const changeHotspot = (index: number, mod: Partial<HotspotZone>) => {
        const { hotspots = [] } = cloneData(room)
        const hotspot = hotspots[index]
        if (!hotspot) {
            return
        }
        Object.assign(hotspot, mod)
        modifyRoom(`change hotspot in room ${room.id}`, room.id, { hotspots })
    }
    const changeZoneByType = (type: "obstacle" | "walkable") => (index: number, mod: Partial<Zone>) => {
        const { walkableAreas = [], obstacleAreas = [] } = cloneData(room)
        const list = type === 'obstacle' ? obstacleAreas : walkableAreas
        const zone = list[index]
        if (!zone) {
            return
        }
        Object.assign(zone, mod)
        modifyRoom(`change ${type} in room ${room.id}`, room.id, { walkableAreas, obstacleAreas })
    }

    const selectZone = (folderId: string, data?: { id: string }) => {
        switch (folderId) {
            case 'WALKABLE': {
                if (!data) {
                    return setActiveWalkableIndex(undefined)
                }
                const zoneIndex = Number(data.id)
                if (isNaN(zoneIndex)) { return }
                return setActiveWalkableIndex(zoneIndex)
            }
            case 'OBSTACLE': {
                if (!data) {
                    return setActiveObstacleIndex(undefined)
                }
                const zoneIndex = Number(data.id)
                if (isNaN(zoneIndex)) { return }
                return setActiveObstacleIndex(zoneIndex)
            }
        }
    }

    const selectHotspot = (id?: string) => {
        if (!id) {
            return setActiveHotspotIndex(undefined)
        }
        const { hotspots = [] } = room;
        const zoneIndex = hotspots.findIndex(hotspot => hotspot.id === id)
        if (zoneIndex === -1) {
            setActiveHotspotIndex(undefined)
        }
        return setActiveHotspotIndex(zoneIndex)
    }

    const handleRoomClick = (
        pointClicked: { x: number; y: number }, viewAngleX: number, viewAngleY: number, clickEffect: ClickEffect
    ) => {
        const changesFromClick = getChangesFromClick(
            pointClicked, viewAngleX, viewAngleY, clickEffect,
            room,
            activeHotspotIndex,
            activeObstacleIndex,
            activeWalkableIndex,
        );
        const updatedRoom = { ...room, ...changesFromClick.roomChange }
        modifyRoom(`click: ${clickEffect.type} in room ${room.id}}`, room.id, changesFromClick.roomChange)
        setActiveHotspotIndex(changesFromClick.activeHotspotIndex)
        setActiveObstacleIndex(changesFromClick.activeObstacleIndex)
        setActiveWalkableIndex(changesFromClick.activeWalkableIndex)
        // need to provide the room as it will be after the state change
        setClickEffect(getNextClickEffect(clickEffect, updatedRoom))
    }

    const getActiveZoneIndex = () => {
        switch (zoneType) {
            case "obstacle":
                return activeObstacleIndex
            case "walkable":
                return activeWalkableIndex
            case "hotspot":
                return activeHotspotIndex
        }
    }

    const getZones = () => {
        switch (zoneType) {
            case "obstacle":
                return room.obstacleAreas ?? []
            case "walkable":
                return room.walkableAreas ?? []
            default:
                return []
        }
    }

    return (
        <RoomClickContext.Provider value={{ clickEffect, setClickEffect }}>
            <LayoutHolder>
                <LayoutControls>
                    {zoneType !== 'hotspot' && (
                        <ZoneSetEditor
                            zones={getZones()}
                            type={zoneType}
                            changeZone={changeZoneByType(zoneType)}
                            remove={removeZone}
                            activeZoneIndex={getActiveZoneIndex()}
                            selectZone={selectZone}
                        />
                    )}
                    {zoneType === 'hotspot' && (
                        <HotspotSetEditor
                            roomId={room.id}
                            changeHotspot={changeHotspot}
                            hotspots={room.hotspots ?? []}
                            removeZone={removeZone}
                            openIndex={activeHotspotIndex}
                            selectHotspot={selectHotspot}
                        />
                    )}
                </LayoutControls>
                <LayoutPreview>
                    <Preview
                        actors={gameDesign.actors}
                        roomData={room}
                        clickEffect={clickEffect}
                        activeZoneIndex={getActiveZoneIndex()}
                        handleRoomClick={handleRoomClick}
                        zoneType={zoneType} />
                </LayoutPreview>
            </LayoutHolder>
        </RoomClickContext.Provider>
    )
}