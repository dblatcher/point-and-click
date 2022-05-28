import { Component } from "preact";
import { RoomData } from "../../definitions/RoomData";
import { Point } from "../../lib/pathfinding/geometry";
import MarkerShape from "../MarkerShape";
import { CharacterOrThing } from "../CharacterOrThing";
import { Room } from "../Room";
import { ClickEffect } from "./ClickEffect";
import { CharacterData } from "../../definitions/CharacterData";
import { locateClickInWorld } from "../../lib/util";

const makeTestCharacter: { (point: Point): CharacterData } = (point) => {
    return {
        id: 'TEST',
        name: 'Seymour Skinner',
        status: 'think',
        type: 'character',
        room: 'SQUARE_ROOM',
        x: point.x,
        y: point.y,
        width: 20,
        height: 50,
        sprite: 'skinner',
        direction: 'left',
        dialogueColor: 'red',
    }
}

type State = {
    viewAngle: number;
    viewScale: number;
    showObstacleAreas: boolean;
    highlightHotspots: boolean;
    showMarker: boolean;
    markerPosition: Point;
    showCharacter: boolean;
    testCharacter: CharacterData;
};

type Props = {
    roomData: RoomData
    clickEffect?: ClickEffect;
    handleRoomClick: { (pointClicked: { x: number, y: number }): void }
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
            viewScale: 1,
            showObstacleAreas: true,
            highlightHotspots: true,
            showMarker: true,
            markerPosition: { x: props.roomData.width / 2, y: 20 },
            showCharacter: true,
            testCharacter: makeTestCharacter({ x: props.roomData.width / 2, y: 20 }),
        }

        this.changeCharacterNumberProperty = this.changeCharacterNumberProperty.bind(this)
    }

    renderCheckBox(label: string, propery: keyof Preview['state']) {
        const { state } = this
        const setValue = (event) => {
            const mod = {}
            mod[propery] = event.target.checked;
            this.setState(mod)
        }
        return (
            <div>
                <label>{label}</label>
                <input type='checkbox' checked={state[propery]}
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

    render() {
        const { viewAngle, viewScale, showObstacleAreas, highlightHotspots, showMarker, markerPosition, testCharacter, showCharacter } = this.state
        const { roomData, handleRoomClick, clickEffect } = this.props

        const processClick = (x: number, y: number) => {
            handleRoomClick(locateClickInWorld(x, y, viewAngle, roomData))
        }

        return (
            <section>
                <p>{getClickCaption(clickEffect)}</p>
                <Room data={roomData}
                    showObstacleAreas={showObstacleAreas}
                    scale={viewScale}
                    viewAngle={viewAngle}
                    highlightHotspots={highlightHotspots}
                    handleHotspotClick={() => { }}
                    handleRoomClick={processClick}
                >
                    {showMarker && (
                        <MarkerShape roomData={roomData}
                            height={50}
                            viewAngle={viewAngle}
                            {...markerPosition}
                            color={'red'} />
                    )}
                    {showCharacter && (
                        <CharacterOrThing
                            data={testCharacter}
                            roomData={roomData}
                            viewAngle={viewAngle} isPaused={false} key={'test'} />
                    )}
                </Room>

                <fieldset>
                    <div>
                        <label>view scale</label>
                        <input type='range' value={viewScale} max={2} min={1} step={.01}
                            onChange={(event) => this.setState({ viewScale: Number(event.target.value) })} />
                        <span>{viewScale}</span>
                    </div>

                    <div>
                        <label>view angle</label>
                        <input type='range' value={viewAngle} max={1} min={-1} step={.01}
                            onChange={(event) => this.setState({ viewAngle: Number(event.target.value) })} />
                        <span>{viewAngle}</span>
                    </div>

                    {this.renderCheckBox('Show Obstacles', 'showObstacleAreas')}
                    {this.renderCheckBox('Show hotspots', 'highlightHotspots')}

                </fieldset>

                <fieldset>
                    {this.renderCheckBox('Show Character', 'showCharacter')}
                    <div>
                        <label>X</label>
                        <input type='range'
                            value={testCharacter.x}
                            min={0} max={roomData.width} step={10}
                            onChange={(event) => this.changeCharacterNumberProperty(Number(event.target.value), 'x')} />
                        <span>{testCharacter.x}</span>
                    </div>
                    <div>
                        <label>Y</label>
                        <input type='range'
                            value={testCharacter.y}
                            min={0} max={roomData.height} step={10}
                            onChange={(event) => this.changeCharacterNumberProperty(Number(event.target.value), 'y')} />
                        <span>{testCharacter.y}</span>
                    </div>
                    <div>
                        <label>base height</label>
                        <input type='range'
                            value={testCharacter.height}
                            min={10} max={200} step={10}
                            onChange={(event) => this.changeCharacterNumberProperty(Number(event.target.value), 'height')} />
                        <span>{testCharacter.height}</span>
                    </div>
                    <div>
                        <label>base width</label>
                        <input type='range'
                            value={testCharacter.width}
                            min={10} max={200} step={10}
                            onChange={(event) => this.changeCharacterNumberProperty(Number(event.target.value), 'width')} />
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
                            onChange={(event) => this.setState({ markerPosition: { x: Number(event.target.value), y: markerPosition.y } })} />
                        <span>{markerPosition.x}</span>
                    </div>
                    <div>
                        <label>Y</label>
                        <input type='range'
                            value={markerPosition.y}
                            min={0}
                            max={roomData.height}
                            step={10}
                            onChange={(event) => this.setState({ markerPosition: { y: Number(event.target.value), x: markerPosition.x } })} />
                        <span>{markerPosition.y}</span>
                    </div>

                </fieldset>
            </section>
        )
    }
}


