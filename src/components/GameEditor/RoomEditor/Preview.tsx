import { BooleanInput } from "@/components/SchemaForm/BooleanInput";
import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { MarkerShape } from "@/components/svg/MarkerShape";
import { useAssets } from "@/context/asset-context";
import { useGameDesign } from "@/context/game-design-context";
import { Box, Typography } from "@mui/material";
import { HorizontalLine, putActorsInDisplayOrder, Room } from "point-click-components";
import { ActorData, getTargetPoint, HotspotZone, RoomData, ZoneType } from "point-click-lib";
import { useState } from "react";
import { ClickEffect } from "./ClickEffect";
import { RoomAngleFrame } from "./RoomAngleFrame";


type Props = {
    roomData: RoomData;
    actors: ActorData[];
    clickEffect?: ClickEffect;
    handleRoomClick: { (pointClicked: { x: number; y: number }, viewAngleX: number, viewAngleY: number, clickEffect: ClickEffect): void };
    activeZoneIndex?: number;
    zoneType: ZoneType
}


function getClickCaption(clickEffect?: ClickEffect): string {
    if (!clickEffect) return ''
    switch (clickEffect.type) {
        case 'ADD_POLYGON_POINT':
            return `Click to add point to ${clickEffect.zoneType}`
        case 'HOTSPOT_WALKTO_POINT':
            return 'Click to set walk to point'
        case 'ZONE_POSITION':
            return `Click to move ${clickEffect.zoneType}`
        case 'MOVE_POLYGON_POINT':
            return `Click to move point ${clickEffect.pointIndex + 1} of ${clickEffect.zoneType}`
        case 'ADD_NEW':
            return `Click to add new ${clickEffect.shape} shaped ${clickEffect.zoneType}`
        default:
            return 'UNKNOWN!'
    }
}

const getHotspotMarkerLabel = (hotspot: HotspotZone | undefined, roomData: RoomData): string => {
    if (!hotspot) { return '' }
    const { x, y } = getTargetPoint(hotspot, roomData)
    const { id, } = hotspot
    return `${id}:[${x}, ${y}]`
}


export const Preview = ({
    roomData,
    handleRoomClick,
    clickEffect,
    actors,
    activeZoneIndex,
    zoneType
}: Props) => {
    const { gameDesign } = useGameDesign()
    const [scale, setScale] = useState(1.5)
    const [viewAngleX, setViewAngleX] = useState(0);
    const [viewAngleY, setViewAngleY] = useState(0);
    const [renderAllZones, setRenderAllZones] = useState(false);
    const [highlightHotspots, setHighlightHotspots] = useState(false);
    const [showScaleLines, setShowScaleLines] = useState(false);
    const [showRealActors, setShowRealActors] = useState(true);
    const { getImageAsset } = useAssets();

    const { scaling = [] } = roomData

    const processClick = (x: number, y: number) => {
        if (clickEffect) {
            handleRoomClick({ x, y }, viewAngleX, viewAngleY, clickEffect)
        }
    }

    const actorsInRoom = showRealActors
        ? actors
            .filter(actor => actor.room === roomData.id)
            .sort(putActorsInDisplayOrder)
            .map(actor => ({ data: actor }))
        : []

    const hotspotToHaveMarkWalkToPoint = zoneType === 'hotspot' && typeof activeZoneIndex === 'number' ? roomData.hotspots?.[activeZoneIndex] : undefined


    return (
        <Box>
            <Box>
                <NumberInput label="preview scale" value={scale} notFullWidth
                    inputHandler={setScale} max={2} min={.5} step={.05} />
            </Box>
            <Box
                display={'inline-block'}
                position={'relative'}
                boxSizing={'border-box'}
            >
                <RoomAngleFrame roomData={roomData}
                    viewAngleX={viewAngleX}
                    viewAngleY={viewAngleY}
                    setViewAngleX={setViewAngleX}
                    setViewAngleY={setViewAngleY}>
                    <Room data={roomData} noSound noMargin
                        sprites={gameDesign.sprites}
                        renderAllZones={renderAllZones}
                        getImageAsset={getImageAsset}
                        maxHeight={(roomData.frameHeight || roomData.height) * scale}
                        maxWidth={roomData.frameWidth * scale}
                        viewAngleX={viewAngleX}
                        viewAngleY={viewAngleY}
                        orderedActors={actorsInRoom}
                        handleRoomClick={processClick}
                        highlightHotspots={highlightHotspots}
                        hotspotIndexToMark={zoneType === 'hotspot' ? activeZoneIndex : undefined}
                        obstacleIndexToMark={zoneType === 'obstacle' ? activeZoneIndex : undefined}
                        walkableIndexToMark={zoneType === 'walkable' ? activeZoneIndex : undefined}
                        surfaceContent={<>
                            {showScaleLines && scaling.map((yAndScale, index) => (
                                <HorizontalLine key={index}
                                    y={yAndScale[0]}
                                    text={`scale: ${yAndScale[1]}`}
                                />
                            ))}
                            {hotspotToHaveMarkWalkToPoint && (
                                <MarkerShape
                                    text={getHotspotMarkerLabel(hotspotToHaveMarkWalkToPoint, roomData)}
                                    {...getTargetPoint(hotspotToHaveMarkWalkToPoint, roomData)}
                                />
                            )}
                        </>}
                    />
                </RoomAngleFrame>

                {clickEffect && (
                    <Typography
                        variant='overline'
                        padding={1}
                        sx={{
                            position: 'absolute',
                            right: 0, top: 0,
                            color: 'white',
                            backgroundColor: 'rgba(0,0,0,.5)'
                        }}>{getClickCaption(clickEffect)}</Typography>
                )}
            </Box>

            <Box gap={4} display={'flex'}>
                <BooleanInput sx={{ minWidth: 125 }} label={"Show Obstacles"} value={renderAllZones} inputHandler={setRenderAllZones} />
                <BooleanInput label={"Show hotspots"} value={highlightHotspots} inputHandler={setHighlightHotspots} />
            </Box>
            <Box gap={4} display={'flex'}>
                <BooleanInput sx={{ minWidth: 125 }} label={"Show Scale lines"} value={showScaleLines} inputHandler={setShowScaleLines} />
                <BooleanInput label={"Show Actors"} value={showRealActors} inputHandler={setShowRealActors} />
            </Box>
        </Box>
    )
}



