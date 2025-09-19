import { ResizeWatcher } from "@/components/ResizeWatcher";
import HorizontalLine from "@/components/svg/HorizontalLine";
import { MarkerShape } from "@/components/svg/MarkerShape";
import { Room } from "@/components/svg/Room";
import { ActorData, HotspotZone, RoomData, ZoneType } from "@/definitions";
import { getTargetPoint, putActorsInDisplayOrder } from "@/lib/roomFunctions";
import { eventToBoolean } from "@/lib/util";
import { Box, Checkbox, Divider, Grid, Stack, Typography } from "@mui/material";
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

    get hotspotToHaveMarkWalkToPoint(): HotspotZone | undefined {
        const { activeZoneIndex: activeHotspotIndex, roomData } = this.props
        const { highlightHotspots } = this.state
        if (typeof activeHotspotIndex === 'undefined' || !highlightHotspots) { return undefined }
        const activeHotspot = roomData.hotspots ? roomData.hotspots[activeHotspotIndex] : undefined
        if (!activeHotspot) { return undefined }
        return activeHotspot
    }

    get walkToPointLabel(): string {
        const { hotspotToHaveMarkWalkToPoint: hotspot } = this
        if (!hotspot) { return '' }
        const { x, y } = getTargetPoint(hotspot, this.props.roomData)
        const { id, } = hotspot
        return `${id}:[${x}, ${y}]`
    }

    get hotspotsToMark(): number[] {
        const { activeZoneIndex, zoneType } = this.props
        if (zoneType === 'hotspot' && typeof activeZoneIndex === 'number') {
            return [activeZoneIndex]
        }
        return []
    }

    get obstaclesToMark(): number[] {
        const { activeZoneIndex, zoneType } = this.props
        if (zoneType === 'obstacle' && typeof activeZoneIndex === 'number') {
            return [activeZoneIndex]
        }
        return []
    }

    get walkablesToMark(): number[] {
        const { activeZoneIndex, zoneType } = this.props
        if (zoneType === 'walkable' && typeof activeZoneIndex === 'number') {
            return [activeZoneIndex]
        }
        return []
    }

    render() {
        const {
            viewAngleX, viewAngleY, maxWidth, renderAllZones, highlightHotspots,
            showRealActors, showScaleLines,
        } = this.state
        const { roomData, handleRoomClick, clickEffect, actors, activeZoneIndex } = this.props
        const { scaling = [] } = roomData

        const processClick = (x: number, y: number) => {
            if (clickEffect) {
                handleRoomClick({ x, y }, viewAngleX, viewAngleY, clickEffect)
            }
        }

        const contents = showRealActors
            ? actors
                .filter(actor => actor.room === roomData.id)
                .sort(putActorsInDisplayOrder)
                .map(actor => ({ data: actor }))
            : []

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
                        display: 'inline-block',
                    }}>
                        <Room data={roomData} noSound noMargin
                            renderAllZones={renderAllZones}
                            maxWidth={maxWidth}
                            maxHeight={Math.min(roomData.height * 2, 600)}
                            viewAngleX={viewAngleX}
                            viewAngleY={viewAngleY}
                            contents={contents}
                            handleRoomClick={processClick}
                            highlightHotspots={highlightHotspots}
                            markHotspotVertices={this.hotspotsToMark}
                            markObstacleVertices={this.obstaclesToMark}
                            markWalkableVertices={this.walkablesToMark}
                        >
                            {showScaleLines && scaling.map((yAndScale, index) => (
                                <HorizontalLine key={index}
                                    y={yAndScale[0]}
                                    text={`scale: ${yAndScale[1]}`}
                                />
                            ))}

                            {this.hotspotToHaveMarkWalkToPoint && (
                                <MarkerShape
                                    text={this.walkToPointLabel}
                                    {...getTargetPoint(this.hotspotToHaveMarkWalkToPoint, roomData)}
                                />
                            )}
                        </Room>
                    </Box>
                    <Box>
                        <ViewAngleSlider viewAngle={viewAngleX} setViewAngle={viewAngleX => this.setState({ viewAngleX })} />
                        <ViewAngleSlider viewAngle={viewAngleY} setViewAngle={viewAngleY => this.setState({ viewAngleY })} />
                        <Divider />

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


