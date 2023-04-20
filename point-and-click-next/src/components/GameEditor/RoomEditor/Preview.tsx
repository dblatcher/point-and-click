import { ChangeEventHandler, Component } from "react";
import { RoomData, ActorData, HotspotZone } from "@/oldsrc";
import { Room } from "@/components/svg/Room";
import { MarkerShape } from "@/components/svg/MarkerShape";
import HorizontalLine from "@/components/svg/HorizontalLine";
import { ClickEffect } from "./ClickEffect";
import { eventToBoolean, eventToNumber } from "@/lib/util";
import { getTargetPoint, putActorsInDisplayOrder } from "@/lib/roomFunctions";
import { makeTestActor } from "./testSprite";
import { Grid, Stack, MenuItem, ButtonGroup } from "@mui/material";
import { EditorBox } from "../EditorBox";
import MenuInButton from "@/components/MenuInButton";

type BooleanState = {
    showObstacleAreas: boolean;
    highlightHotspots: boolean;
    showScaleLines: boolean;
    showTestActor: boolean;
    showRealActors: boolean;
}

type State = BooleanState & {
    viewAngle: number;
    maxWidth: number;
    testActor: ActorData;
};

type Props = {
    roomData: RoomData;
    actors: ActorData[];
    clickEffect?: ClickEffect;
    handleRoomClick: { (pointClicked: { x: number; y: number }, viewAngle: number): void };
    activeHotspotIndex?: number;
}


function getClickCaption(clickEffect?: ClickEffect): string {
    if (!clickEffect) return ''
    switch (clickEffect.type) {
        case 'OBSTACLE':
            return `Click to add new ${clickEffect.shape} obstable`
        case 'POLYGON_POINT_OBSTACLE':
            return `Click to add new point`
        case 'WALKABLE':
            return `Click to add new ${clickEffect.shape} walkable`
        case 'POLYGON_POINT_WALKABLE':
            return `Click to add new point`
        case 'HOTSPOT':
            return `Click to add new ${clickEffect.shape} hotspot`
        case 'POLYGON_POINT_HOTSPOT':
            return `Click to add new point`
        case 'HOTSPOT_WALKTO_POINT':
            return 'Click to set walk to point'
        default:
            return 'UNKNOWN!'
    }
}

export class Preview extends Component<Props, State>{

    constructor(props: Props) {
        super(props)
        this.state = {
            viewAngle: 0,
            maxWidth: 400,
            showObstacleAreas: true,
            highlightHotspots: true,
            showScaleLines: false,
            showTestActor: false,
            showRealActors: true,
            testActor: makeTestActor({ x: props.roomData.width / 2, y: 20 }),
        }

        this.changeActorNumberProperty = this.changeActorNumberProperty.bind(this)
    }

    renderCheckBox(label: string, propery: keyof BooleanState) {
        const { state } = this
        const setValue: ChangeEventHandler<HTMLInputElement> = (event) => {
            const mod: Partial<BooleanState> = {}
            mod[propery] = eventToBoolean(event.nativeEvent);
            this.setState(mod)
        }
        return (
            <div>
                <label>{label}</label>
                <input type='checkbox' checked={!!state[propery]}
                    onChange={setValue} />
                <span>{state[propery] ? 'YES' : 'NO'}</span>
            </div>
        )
    }

    renderSlider(label: string, value: number, max: number, min: number, step: number, onChange: ChangeEventHandler<HTMLInputElement>) {

        return (
            <div>
                <label>{label}</label>
                <input type='range' value={value} max={max} min={min} step={step}
                    onChange={onChange} />
                <span>{value}</span>
            </div>
        )
    }

    changeActorNumberProperty(value: number, property: 'x' | 'y' | 'height' | 'width') {
        this.setState(
            (state) => {
                const { testActor } = state
                testActor[property] = value
                return { testActor }
            }
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
        if (clickEffect?.type === 'POLYGON_POINT_HOTSPOT') {
            return [clickEffect.index]
        }
        return [];
    }

    get obstaclesToMark(): number[] {
        const { clickEffect } = this.props
        if (clickEffect?.type === 'POLYGON_POINT_OBSTACLE') {
            return [clickEffect.index]
        }
        return [];
    }

    get walkablesToMark(): number[] {
        const { clickEffect } = this.props
        if (clickEffect?.type === 'POLYGON_POINT_WALKABLE') {
            return [clickEffect.index]
        }
        return [];
    }

    render() {
        const {
            viewAngle, maxWidth, showObstacleAreas, highlightHotspots,
            testActor, showTestActor, showRealActors,
            showScaleLines,
        } = this.state
        const { roomData, handleRoomClick, clickEffect, actors, activeHotspotIndex } = this.props
        const { scaling = [] } = roomData

        const processClick = (x: number, y: number) => {
            handleRoomClick({ x, y }, viewAngle)
        }

        const contents = showRealActors
            ? actors
                .filter(actor => actor.room === roomData.id)
                .sort(putActorsInDisplayOrder)
                .map(actor => ({ data: actor }))
            : []

        if (showTestActor) {
            contents.push({ data: testActor })
        }

        return (

            <Stack spacing={1} alignItems={'flex-start'}>
                <ButtonGroup>
                    <MenuInButton buttonText="view" buttonId="view-options">
                        <Stack padding={1}>
                            {this.renderSlider('Width', maxWidth, 800, 100, 25,
                                (event) => this.setState({ maxWidth: eventToNumber(event.nativeEvent) }))
                            }
                            {this.renderSlider('view angle', viewAngle, 1, -1, .01,
                                (event) => this.setState({ viewAngle: eventToNumber(event.nativeEvent) }))
                            }
                            {this.renderCheckBox('Show Obstacles', 'showObstacleAreas')}
                            {this.renderCheckBox('Show hotspots', 'highlightHotspots')}
                            {this.renderCheckBox('Show Scale lines', 'showScaleLines')}
                            {this.renderCheckBox('Show Actors', 'showRealActors')}
                        </Stack>
                    </MenuInButton>

                    <MenuInButton buttonText="Test Actor" buttonId="test-actor">
                        <Stack padding={1}>
                            {this.renderCheckBox('Show', 'showTestActor')}
                            <div>
                                <label>X</label>
                                <input type='range' disabled={!showTestActor}
                                    value={testActor.x}
                                    min={0} max={roomData.width} step={10}
                                    onChange={(event) => this.changeActorNumberProperty(eventToNumber(event.nativeEvent), 'x')} />
                                <span>{testActor.x}</span>
                            </div>
                            <div>
                                <label>Y</label>
                                <input type='range' disabled={!showTestActor}
                                    value={testActor.y}
                                    min={0} max={roomData.height} step={10}
                                    onChange={(event) => this.changeActorNumberProperty(eventToNumber(event.nativeEvent), 'y')} />
                                <span>{testActor.y}</span>
                            </div>
                            <div>
                                <label>base height</label>
                                <input type='range' disabled={!showTestActor}
                                    value={testActor.height}
                                    min={10} max={200} step={10}
                                    onChange={(event) => this.changeActorNumberProperty(eventToNumber(event.nativeEvent), 'height')} />
                                <span>{testActor.height}</span>
                            </div>
                            <div>
                                <label>base width</label>
                                <input type='range' disabled={!showTestActor}
                                    value={testActor.width}
                                    min={10} max={200} step={10}
                                    onChange={(event) => this.changeActorNumberProperty(eventToNumber(event.nativeEvent), 'width')} />
                                <span>{testActor.width}</span>
                            </div>
                        </Stack>
                    </MenuInButton>
                </ButtonGroup>


                <section style={{
                    marginTop: '5px',
                    position: 'relative',
                    border: '5px dotted red',
                    display: 'inline-block',
                    background: 'black'
                }}>
                    <Room data={roomData} noResize forPreview
                        showObstacleAreas={showObstacleAreas}
                        maxWidth={maxWidth} maxHeight={1000}
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
                    <p style={{
                        position: 'absolute',
                        right: 0, top: 0,
                        margin: "0 1em",
                        padding: "0 .25em",
                        color: 'white',
                        backgroundColor: 'rgba(0,0,0,.5)'
                    }}>{getClickCaption(clickEffect)}</p>
                </section>
            </Stack>

        )
    }
}


