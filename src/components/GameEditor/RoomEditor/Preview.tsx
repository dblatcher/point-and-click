import { ResizeWatcher } from "@/components/ResizeWatcher";
import HorizontalLine from "@/components/svg/HorizontalLine";
import { MarkerShape } from "@/components/svg/MarkerShape";
import { Room } from "@/components/svg/Room";
import { ActorData, HotspotZone, RoomData, ZoneType } from "@/definitions";
import { getTargetPoint, putActorsInDisplayOrder } from "@/lib/roomFunctions";
import { eventToBoolean } from "@/lib/util";
import { Box, Checkbox, Grid, Stack, Typography } from "@mui/material";
import { ChangeEventHandler, Component } from "react";
import { ClickEffect } from "./ClickEffect";
import { ViewAngleSlider } from "./ViewAngleSlider";

type BooleanState = {
    renderAllZones: boolean;
    highlightHotspots: boolean;
    showScaleLines: boolean;
    showRealActors: boolean;
}

type State = BooleanState & {
    viewAngleX: number;
    viewAngleY: number;
    maxWidth: number;
};

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

export class Preview extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            viewAngleX: 0,
            viewAngleY: 0,
            maxWidth: 500,
            renderAllZones: false,
            highlightHotspots: false,
            showScaleLines: false,
            showRealActors: true,
        }
    }

    renderCheckBox(label: string, propery: keyof BooleanState) {
        const { state } = this
        const setValue: ChangeEventHandler<HTMLInputElement> = (event) => {
            const mod: Partial<BooleanState> = {}
            mod[propery] = eventToBoolean(event.nativeEvent);
            this.setState({ ...state, ...mod })
        }
        return (
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography component={'label'} variant="body2">{label}</Typography>
                <Checkbox checked={!!state[propery]} onChange={setValue} size="small" />
            </Stack>
        )
    }


    render() {
        const {
            viewAngleX, viewAngleY, maxWidth, renderAllZones, highlightHotspots,
            showRealActors, showScaleLines,
        } = this.state
        const { roomData, handleRoomClick, clickEffect, actors, activeZoneIndex, zoneType } = this.props
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
            <ResizeWatcher resizeHandler={() => {
                const container = document.querySelector('.iwillreplacewitharef')
                if (container) {
                    this.setState({ maxWidth: container.clientWidth - 50 })
                }
            }}>
                <Box className="iwillreplacewitharef"
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'flex-end'}
                    alignItems={'center'}
                    flexBasis={'100%'}
                    position={'relative'}
                    boxSizing={'border-box'}
                    padding={1}
                >
                    <Box sx={{
                        position: 'relative',
                        display: 'inline-flex',
                    }}>
                        <ViewAngleSlider viewAngle={viewAngleY}
                            disabled={roomData.height === roomData.frameHeight}
                            setViewAngle={viewAngleY => this.setState({ viewAngleY })}
                            forY
                            trackLength={'100%'} />
                        <Room data={roomData} noSound noMargin
                            renderAllZones={renderAllZones}
                            maxWidth={maxWidth}
                            maxHeight={Math.min(roomData.height * 2, 600)}
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
                    </Box>
                    <Box sx={{
                        width: '100%',
                        boxSizing: 'border-box',
                        paddingLeft: 20,
                        paddingRight: 10
                    }}>
                        <ViewAngleSlider viewAngle={viewAngleX}
                            setViewAngle={viewAngleX => this.setState({ viewAngleX })}
                            disabled={roomData.width === roomData.frameWidth}
                            trackLength={'100%'} />
                    </Box>
                    <Box>
                        <Grid container>
                            <Grid item>
                                {this.renderCheckBox('Show Obstacles', 'renderAllZones')}
                            </Grid>
                            <Grid item>
                                {this.renderCheckBox('Show hotspots', 'highlightHotspots')}
                            </Grid>
                            <Grid item>
                                {this.renderCheckBox('Show Scale lines', 'showScaleLines')}
                            </Grid>
                            <Grid item>
                                {this.renderCheckBox('Show Actors', 'showRealActors')}
                            </Grid>
                        </Grid>
                    </Box>

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
            </ResizeWatcher>
        )
    }
}


