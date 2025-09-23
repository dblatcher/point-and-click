import { NumberInput } from "@/components/SchemaForm/NumberInput";
import HorizontalLine from "@/components/svg/HorizontalLine";
import { MarkerShape } from "@/components/svg/MarkerShape";
import { Room } from "@/components/svg/Room";
import { ActorData, HotspotZone, RoomData, ZoneType } from "@/definitions";
import { getTargetPoint, putActorsInDisplayOrder } from "@/lib/roomFunctions";
import { Box, Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";
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
            return `Click to add new ${clickEffect.shape} shaped ${clickEffect}`
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
    const [scale, setScale] = useState(1.5)
    const [viewAngleX, setViewAngleX] = useState(0);
    const [viewAngleY, setViewAngleY] = useState(0);
    const [renderAllZones, setRenderAllZones] = useState(false);
    const [highlightHotspots, setHighlightHotspots] = useState(false);
    const [showScaleLines, setShowScaleLines] = useState(false);
    const [showRealActors, setShowRealActors] = useState(true);

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
                        renderAllZones={renderAllZones}
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

            <Stack paddingLeft={'30px'}>
                <FormControlLabel
                    label={"Show Obstacles"}
                    control={
                        <Checkbox
                            checked={renderAllZones}
                            onChange={(_, value) => setRenderAllZones(value)}
                            size="small" />
                    } />

                <FormControlLabel
                    label={"Show hotspots"}
                    control={
                        <Checkbox
                            checked={highlightHotspots}
                            onChange={(_, value) => setHighlightHotspots(value)}
                            size="small" />
                    } />
                <FormControlLabel
                    label={"Show Scale lines"}
                    control={
                        <Checkbox
                            checked={showScaleLines}
                            onChange={(_, value) => setShowScaleLines(value)}
                            size="small" />
                    } />
                <FormControlLabel
                    label={"Show Actors"}
                    control={
                        <Checkbox
                            checked={showRealActors}
                            onChange={(_, value) => setShowRealActors(value)}
                            size="small" />
                    } />
            </Stack>
        </Box>
    )
}



