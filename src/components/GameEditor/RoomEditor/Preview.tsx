import { ResizeWatcher } from "@/components/ResizeWatcher";
import HorizontalLine from "@/components/svg/HorizontalLine";
import { MarkerShape } from "@/components/svg/MarkerShape";
import { Room } from "@/components/svg/Room";
import { ActorData, HotspotZone, RoomData } from "@/definitions";
import { getTargetPoint, putActorsInDisplayOrder } from "@/lib/roomFunctions";
import { eventToBoolean } from "@/lib/util";
import { Box, Checkbox, Divider, Grid, Stack, Typography } from "@mui/material";
import { ChangeEventHandler, Component } from "react";
import { ClickEffect } from "./ClickEffect";
import { ViewAngleSlider } from "./ViewAngleSlider";

type BooleanState = {
    showObstacleAreas: boolean;
    highlightHotspots: boolean;
    showScaleLines: boolean;
    showRealActors: boolean;
}

type State = BooleanState & {
    viewAngle: number;
    maxWidth: number;
};

type Props = {
    roomData: RoomData;
    actors: ActorData[];
    clickEffect?: ClickEffect;
    handleRoomClick: { (pointClicked: { x: number; y: number }, viewAngle: number, clickEffect: ClickEffect): void };
    activeHotspotIndex?: number;
}


function getClickCaption(clickEffect?: ClickEffect): string {
    if (!clickEffect) return ''
    switch (clickEffect.type) {
        case 'POLYGON_POINT_OBSTACLE':
            return `Click to add new point`
        case 'POLYGON_POINT_WALKABLE':
            return `Click to add new point`
        case 'POLYGON_POINT_HOTSPOT':
            return `Click to add new point`
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
            viewAngle: 0,
            maxWidth: 500,
            showObstacleAreas: true,
            highlightHotspots: true,
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
        const { activeHotspotIndex, roomData } = this.props
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
        const { clickEffect } = this.props
        if (!clickEffect || !('index' in clickEffect)) {
            return []
        }
        if (clickEffect.type === 'POLYGON_POINT_HOTSPOT' || ('zoneType' in clickEffect && clickEffect.zoneType == 'hotspot')) {
            return [clickEffect.index]
        }
        return [];
    }

    get obstaclesToMark(): number[] {
        const { clickEffect } = this.props
        if (!clickEffect || !('index' in clickEffect)) {
            return []
        }
        if (clickEffect.type === 'POLYGON_POINT_OBSTACLE' || ('zoneType' in clickEffect && clickEffect.zoneType == 'obstacle')) {
            return [clickEffect.index]
        }
        return [];
    }

    get walkablesToMark(): number[] {
        const { clickEffect } = this.props
        if (!clickEffect || !('index' in clickEffect)) {
            return []
        }
        if (clickEffect?.type === 'POLYGON_POINT_WALKABLE' || ('zoneType' in clickEffect && clickEffect.zoneType == 'walkable')) {
            return [clickEffect.index]
        }
        return [];
    }

    render() {
        const {
            viewAngle, maxWidth, showObstacleAreas, highlightHotspots,
            showRealActors, showScaleLines,
        } = this.state
        const { roomData, handleRoomClick, clickEffect, actors, activeHotspotIndex } = this.props
        const { scaling = [] } = roomData

        const processClick = (x: number, y: number) => {
            if (clickEffect) {
                handleRoomClick({ x, y }, viewAngle, clickEffect)
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
                        <Room data={roomData} forPreview
                            showObstacleAreas={showObstacleAreas}
                            maxWidth={maxWidth}
                            maxHeight={Math.min(roomData.height * 2, 600)}
                            viewAngle={viewAngle}
                            highlightHotspots={highlightHotspots}
                            handleRoomClick={processClick}
                            markHotspotVertices={this.hotspotsToMark}
                            markObstacleVertices={this.obstaclesToMark}
                            flashHotspot={activeHotspotIndex}
                            markWalkableVertices={this.walkablesToMark}
                            contents={contents}
                        >
                            {showScaleLines && scaling.map((yAndScale, index) => (
                                <HorizontalLine key={index}
                                    y={yAndScale[0]}
                                    text={`scale: ${yAndScale[1]}`}
                                    roomData={roomData} />
                            ))}

                            {this.hotspotToHaveMarkWalkToPoint && (
                                <MarkerShape
                                    roomData={roomData}
                                    viewAngle={viewAngle}
                                    color={'red'}
                                    text={this.walkToPointLabel}
                                    {...getTargetPoint(this.hotspotToHaveMarkWalkToPoint, roomData)}
                                />
                            )}
                        </Room>
                    </Box>
                    <Box>
                        <ViewAngleSlider viewAngle={viewAngle} setViewAngle={viewAngle => this.setState({ viewAngle })} />
                        <Divider />

                        <Grid container>
                            <Grid item>
                                {this.renderCheckBox('Show Obstacles', 'showObstacleAreas')}
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


