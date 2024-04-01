import { useGameDesign } from "@/context/game-design-context"
import { HotspotZone, RoomData, Zone } from "@/definitions"
import { Grid } from "@mui/material"
import { AccoridanedContent } from "../../AccordianedContent"
import { ClickEffect } from "../ClickEffect"
import { Preview } from "../Preview"
import { HotspotSetEditor } from "./HotspotSetEditor"
import { ShapeChangeFunction } from "./ShapeControl"
import { ZoneSetEditor } from "./ZoneSetEditor"
import { cloneData } from "@/lib/clone"
import { useState } from "react"
import { getNextClickEffect } from "./lib"

interface Props {
    room: RoomData;
    activeHotspotIndex?: number;
    activeObstacleIndex?: number;
    activeWalkableIndex?: number;
    handleRoomClick: { (pointClicked: { x: number; y: number }, viewAngle: number, clickEffect: ClickEffect): void }
    selectZone: { (folderId: string, data?: { id: string }): void }
}

export const ZoneFeaturesControl = ({
    room, activeHotspotIndex, activeObstacleIndex, activeWalkableIndex,
    handleRoomClick, selectZone
}: Props) => {

    const [clickEffect, setClickEffect] = useState<ClickEffect | undefined>(undefined)
    const { gameDesign, performUpdate } = useGameDesign()


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
        performUpdate('rooms', { ...room, obstacleAreas, hotspots, walkableAreas })
    }

    const changeZone: ShapeChangeFunction = (index, propery, newValue, type) => {
        const getMod = () => {
            const { obstacleAreas = [], hotspots = [], walkableAreas = [] } = cloneData(room)
            function handleCommonValues(zoneOrHotspot: Zone | HotspotZone) {
                switch (propery) {
                    case 'x':
                    case 'y':
                    case 'circle':
                        if (typeof newValue === 'number') {
                            zoneOrHotspot[propery] = newValue
                        }
                        break;
                    case 'path':
                        if (typeof newValue === 'string') {
                            zoneOrHotspot[propery] = newValue
                        }
                        break;
                    case 'rect':
                        zoneOrHotspot[propery] = newValue as [number, number]
                        break;
                    case 'polygon':
                        zoneOrHotspot[propery] = newValue as [number, number][]
                        break;
                }
            }

            if (type === 'hotspot') {
                const hotspot = hotspots[index]
                handleCommonValues(hotspot)
                switch (propery) {
                    case 'parallax':
                        if (typeof newValue === 'number') {
                            hotspot[propery] = newValue
                        }
                        break;
                    case 'walkToX':
                    case 'walkToY':
                        if (typeof newValue === 'number' || typeof newValue === 'undefined') {
                            hotspot[propery] = newValue
                        }
                        break;
                    case 'id':
                    case 'name':
                    case 'status':
                        if (typeof newValue === 'string') {
                            hotspot[propery] = newValue
                        }
                        break;
                }
            } else {
                const zone = type == 'obstacle' ? obstacleAreas[index] : walkableAreas[index]
                handleCommonValues(zone)
                switch (propery) {
                    case 'ref':
                        if (typeof newValue === 'string' || typeof newValue === 'undefined') {
                            zone[propery] = newValue
                        }
                        break;
                    case 'disabled':
                        if (typeof newValue === 'boolean' || typeof newValue === 'undefined') {
                            zone[propery] = newValue
                        }
                        break;
                }
            }
            return { obstacleAreas, hotspots, walkableAreas }
        }
        performUpdate('rooms', { ...room, ...getMod() })
    }

    const buildFeatureTabs = () => {
        const {
            obstacleAreas = [], hotspots = [], walkableAreas = [],
        } = room

        return [
            {
                label: 'Hotspots', content: (
                    <HotspotSetEditor
                        hotspots={hotspots}
                        setClickEffect={setClickEffect}
                        changeZone={changeZone}
                        removeZone={removeZone}
                        openIndex={activeHotspotIndex}
                        selectZone={selectZone}
                        clickEffect={clickEffect}
                    />
                )
            },
            {
                label: 'Obstacles', content: (
                    <ZoneSetEditor
                        zones={obstacleAreas}
                        type='obstacle'
                        setClickEffect={setClickEffect}
                        change={changeZone}
                        remove={removeZone}
                        activeZoneIndex={activeObstacleIndex}
                        selectZone={selectZone}
                        clickEffect={clickEffect}
                    />
                )
            },
            {
                label: 'Walkables', content: (
                    <ZoneSetEditor
                        zones={walkableAreas}
                        type='walkable'
                        setClickEffect={setClickEffect}
                        change={changeZone}
                        remove={removeZone}
                        activeZoneIndex={activeWalkableIndex}
                        selectZone={selectZone}
                        clickEffect={clickEffect}
                    />
                )
            },
        ]

    }




    return (
        <Grid container flexWrap={'nowrap'} spacing={1}>
            <Grid item xs={4}>
                <AccoridanedContent tabs={buildFeatureTabs()} />
            </Grid>
            <Grid item flex={1}>
                <div style={{ position: 'sticky', top: 1 }}>
                    <Preview
                        actors={gameDesign.actors}
                        roomData={room}
                        clickEffect={clickEffect}
                        activeHotspotIndex={activeHotspotIndex}
                        handleRoomClick={(pointClicked, viewAngle, clickEffect) => {
                            handleRoomClick(pointClicked, viewAngle, clickEffect);
                            setClickEffect(getNextClickEffect(clickEffect, room))
                        }} />
                </div>
            </Grid>
        </Grid>
    )
}