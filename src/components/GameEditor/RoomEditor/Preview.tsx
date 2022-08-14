/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h, Fragment, JSX } from "preact";
import { RoomData, CharacterData } from "src";
import { Room } from "../../Room";
import { ClickEffect } from "./ClickEffect";
import { eventToBoolean, eventToNumber } from "../../../lib/util";
import HorizontalLine from "../../HorizontalLine";
import { makeTestCharacter } from "./testSprite";

type BooleanState = {
    showObstacleAreas: boolean;
    highlightHotspots: boolean;
    showScaleLines: boolean;
    showCharacter: boolean;
}

type State = BooleanState & {
    viewAngle: number;
    maxHeight: number;
    testCharacter: CharacterData;
};

type Props = {
    roomData: RoomData;
    clickEffect?: ClickEffect;
    handleRoomClick: { (pointClicked: { x: number; y: number }, viewAngle: number): void };
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
        default:
            return 'UNKNOWN!'
    }
}

export class Preview extends Component<Props, State>{

    constructor(props: Preview['props']) {
        super(props)
        this.state = {
            viewAngle: 0,
            maxHeight: 400,
            showObstacleAreas: true,
            highlightHotspots: true,
            showScaleLines: true,
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

    get walkablesToMark(): number[] {
        const { clickEffect } = this.props
        if (clickEffect?.type === 'POLYGON_POINT_WALKABLE') {
            return [clickEffect.index]
        }
        return [];
    }

    render() {
        const {
            viewAngle, maxHeight, showObstacleAreas, highlightHotspots,
            testCharacter, showCharacter,
            showScaleLines,
        } = this.state
        const { roomData, handleRoomClick, clickEffect } = this.props
        const { scaling = [] } = roomData

        const processClick = (x: number, y: number) => {
            handleRoomClick({ x, y }, viewAngle)
        }

        return (
            <>
                <section style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <fieldset>
                        <div>
                            <label>View height</label>
                            <input type='range' value={maxHeight} max={1000} min={100} step={50}
                                onChange={(event) => this.setState({ maxHeight: eventToNumber(event) })} />
                            <span>{maxHeight}</span>
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
                </section>
                <section style={{ position: 'relative' }}>
                    <Room data={roomData} noResize
                        showObstacleAreas={showObstacleAreas}
                        maxWidth={1000} maxHeight={maxHeight}
                        viewAngle={viewAngle}
                        highlightHotspots={highlightHotspots}
                        handleRoomClick={processClick}
                        markHotspotVertices={this.hotspotsToMark}
                        markObstacleVertices={this.obstaclesToMark}
                        markWalkableVertices={this.walkablesToMark}
                        contents={showCharacter ? [
                            {
                                data: testCharacter,
                                orders: [],
                            }
                        ] : undefined}
                    >
                        {showScaleLines && scaling.map((yAndScale, index) => (
                            <HorizontalLine key={index}
                                y={yAndScale[0]}
                                text={`scale: ${yAndScale[1]}`}
                                roomData={roomData} />
                        ))}
                    </Room>
                    <p style={{ position: 'absolute', right: 0, top: 0, margin: "0 1em" }}>{getClickCaption(clickEffect)}</p>
                </section>
            </>
        )
    }
}


