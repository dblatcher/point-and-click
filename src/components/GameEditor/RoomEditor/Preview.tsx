/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h, Fragment, JSX } from "preact";
import { RoomData, CharacterData } from "src";
import { Point } from "../../../lib/pathfinding/geometry";
import MarkerShape from "../../MarkerShape";
import { Room } from "../../Room";
import { ClickEffect } from "./ClickEffect";
import { eventToBoolean, eventToNumber } from "../../../lib/util";
import HorizontalLine from "../../HorizontalLine";
import { makeTestCharacter } from "./testSprite";

type BooleanState = {
    showObstacleAreas: boolean;
    highlightHotspots: boolean;
    showScaleLines: boolean;
    showMarker: boolean;
    showCharacter: boolean;
}

type State = BooleanState & {
    viewAngle: number;
    maxWidth: number;
    markerPosition: Point;
    testCharacter: CharacterData;
};

type Props = {
    roomData: RoomData;
    clickEffect?: ClickEffect;
    handleRoomClick: { (pointClicked: { x: number; y: number }, viewAngle: number): void };
}


function getClickCaption(clickEffect?: ClickEffect): string {
    if (!clickEffect) return '_'
    switch (clickEffect.type) {
        case 'OBSTACLE':
            return `Click to add new ${clickEffect.shape} obstable`
        case 'POLYGON_POINT_OBSTACLE':
            return `Click to add new point`
        case 'HOTSPOT':
            return `Click to add new ${clickEffect.shape} hotspot`
        case 'POLYGON_POINT_HOTSPOT':
            return `Click to add new point`
        default:
            return 'UNKNOWN!'
    }
}

export class Preview extends Component<Props, State>{

    constructor(props: Preview['props']) {
        super(props)
        this.state = {
            viewAngle: 0,
            maxWidth: 400,
            showObstacleAreas: true,
            highlightHotspots: true,
            showScaleLines: true,
            showMarker: false,
            markerPosition: { x: props.roomData.width / 2, y: 20 },
            showCharacter: true,
            testCharacter: makeTestCharacter({ x: props.roomData.width / 2, y: 20 }),
        }

        this.changeCharacterNumberProperty = this.changeCharacterNumberProperty.bind(this)
    }

    renderCheckBox(label: string, propery: keyof BooleanState) {
        const { state } = this
        const setValue = (event: JSX.TargetedEvent<HTMLInputElement>) => {
            const mod: Partial<BooleanState> = {}
            mod[propery] = eventToBoolean(event);
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

    changeCharacterNumberProperty(value: number, property: 'x' | 'y' | 'height' | 'width') {
        this.setState(
            (state) => {
                const { testCharacter } = state
                testCharacter[property] = value
                return { testCharacter }
            }
        )
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

    render() {
        const {
            viewAngle, maxWidth, showObstacleAreas, highlightHotspots,
            showMarker, markerPosition, testCharacter, showCharacter,
            showScaleLines,
        } = this.state
        const { roomData, handleRoomClick, clickEffect } = this.props
        const { scaling = [] } = roomData

        const processClick = (x: number, y: number) => {
            handleRoomClick({ x, y }, viewAngle)
        }

        return (
            <>
                <section>
                    <p>{getClickCaption(clickEffect)}</p>
                    <Room data={roomData} noResize
                        showObstacleAreas={showObstacleAreas}
                        maxWidth={maxWidth} maxHeight={1000}
                        viewAngle={viewAngle}
                        highlightHotspots={highlightHotspots}
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        handleRoomClick={processClick}
                        markHotspotVertices={this.hotspotsToMark}
                        markObstacleVertices={this.obstaclesToMark}
                        contents={showCharacter ? [
                            {
                                data: testCharacter,
                                orders: [],
                            }
                        ] : undefined}
                    >
                        {showMarker && (
                            <MarkerShape roomData={roomData}
                                height={50}
                                viewAngle={viewAngle}
                                {...markerPosition}
                                color={'red'} />
                        )}

                        {showScaleLines && scaling.map((yAndScale, index) => (
                            <HorizontalLine key={index}
                                y={yAndScale[0]}
                                text={`scale: ${yAndScale[1]}`}
                                roomData={roomData} />
                        ))}
                    </Room>
                </section>
                <section style={{
                    display:'flex',
                }}>
                    <fieldset>
                        <div>
                            <label>View width</label>
                            <input type='range' value={maxWidth} max={1000} min={100} step={50}
                                onChange={(event) => this.setState({ maxWidth: eventToNumber(event) })} />
                            <span>{maxWidth}</span>
                        </div>

                        <div>
                            <label>view angle</label>
                            <input type='range' value={viewAngle} max={1} min={-1} step={.01}
                                onChange={(event) => this.setState({ viewAngle: eventToNumber(event) })} />
                            <span>{viewAngle}</span>
                        </div>

                        {this.renderCheckBox('Show Obstacles', 'showObstacleAreas')}
                        {this.renderCheckBox('Show hotspots', 'highlightHotspots')}
                        {this.renderCheckBox('Show Scale lines', 'showScaleLines')}

                    </fieldset>

                    <fieldset>
                        {this.renderCheckBox('Show Character', 'showCharacter')}
                        <div>
                            <label>X</label>
                            <input type='range'
                                value={testCharacter.x}
                                min={0} max={roomData.width} step={10}
                                onChange={(event) => this.changeCharacterNumberProperty(eventToNumber(event), 'x')} />
                            <span>{testCharacter.x}</span>
                        </div>
                        <div>
                            <label>Y</label>
                            <input type='range'
                                value={testCharacter.y}
                                min={0} max={roomData.height} step={10}
                                onChange={(event) => this.changeCharacterNumberProperty(eventToNumber(event), 'y')} />
                            <span>{testCharacter.y}</span>
                        </div>
                        <div>
                            <label>base height</label>
                            <input type='range'
                                value={testCharacter.height}
                                min={10} max={200} step={10}
                                onChange={(event) => this.changeCharacterNumberProperty(eventToNumber(event), 'height')} />
                            <span>{testCharacter.height}</span>
                        </div>
                        <div>
                            <label>base width</label>
                            <input type='range'
                                value={testCharacter.width}
                                min={10} max={200} step={10}
                                onChange={(event) => this.changeCharacterNumberProperty(eventToNumber(event), 'width')} />
                            <span>{testCharacter.width}</span>
                        </div>
                    </fieldset>

                    <fieldset>
                        {this.renderCheckBox('Show Marker', 'showMarker')}
                        <div>
                            <label>X</label>
                            <input type='range'
                                value={markerPosition.x}
                                min={0}
                                max={roomData.width}
                                step={10}
                                onChange={(event) => this.setState({ markerPosition: { x: eventToNumber(event), y: markerPosition.y } })} />
                            <span>{markerPosition.x}</span>
                        </div>
                        <div>
                            <label>Y</label>
                            <input type='range'
                                value={markerPosition.y}
                                min={0}
                                max={roomData.height}
                                step={10}
                                onChange={(event) => this.setState({ markerPosition: { y: eventToNumber(event), x: markerPosition.x } })} />
                            <span>{markerPosition.y}</span>
                        </div>

                    </fieldset>
                </section>

            </>
        )
    }
}


