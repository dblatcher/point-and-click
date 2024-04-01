import { Grid } from "@mui/material"
import { AccoridanedContent } from "../../AccordianedContent"
import { Preview } from "../Preview"
import { useGameDesign } from "@/context/game-design-context"
import { RoomData } from "@/definitions"
import { ClickEffect } from "../ClickEffect"
import { ReactNode } from "react"
import { ShapeChangeFunction } from "./ShapeControl"
import { HotspotSetEditor } from "./HotspotSetEditor"
import { ZoneSetEditor } from "./ZoneSetEditor"

interface Props {
    room: RoomData;
    clickEffect?: ClickEffect;
    activeHotspotIndex?: number;
    activeObstacleIndex?: number;
    activeWalkableIndex?: number;
    handleRoomClick: { (pointClicked: { x: number; y: number }, viewAngle: number): void }
    setClickEffect: { (clickEffect?: ClickEffect): void };
    changeZone: ShapeChangeFunction;
    removeZone: { (index: number, type?: 'hotspot' | 'obstacle' | 'walkable'): void };
    selectZone: { (folderId: string, data?: { id: string }): void }
}

export const ZoneFeaturesControl = ({
    room, clickEffect, activeHotspotIndex, activeObstacleIndex, activeWalkableIndex,
    handleRoomClick, setClickEffect, changeZone, removeZone, selectZone
}: Props) => {

    const { gameDesign } = useGameDesign()


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
                        handleRoomClick={handleRoomClick} />
                </div>
            </Grid>
        </Grid>
    )
}