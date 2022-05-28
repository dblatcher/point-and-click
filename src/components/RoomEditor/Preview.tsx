import { Component } from "preact";
import { RoomData } from "../../definitions/RoomData";
import { Point } from "../../lib/pathfinding/geometry";
import MarkerShape from "../MarkerShape";
import { Room } from "../Room";
import { ClickEffect } from "./ClickEffect";


type State = {
    viewAngle: number;
    viewScale: number;
    showObstacleAreas: boolean;
    highlightHotspots: boolean;
    showMarker: boolean;
    markerPosition: Point
};

type Props = {
    roomData: RoomData
    clickEffect?: ClickEffect;
    handleRoomClick: { (x: number, y: number): void }
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
            markerPosition: { x: props.roomData.width / 2, y: 20 }
        }
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

    render() {
        const { viewAngle, viewScale, showObstacleAreas, highlightHotspots, showMarker, markerPosition } = this.state
        const { roomData, handleRoomClick, clickEffect } = this.props

        return (
            <section>
                <p>{getClickCaption(clickEffect)}</p>
                <Room data={roomData}
                    showObstacleAreas={showObstacleAreas}
                    scale={viewScale}
                    viewAngle={viewAngle}
                    highlightHotspots={highlightHotspots}
                    handleHotspotClick={() => { }}
                    handleRoomClick={handleRoomClick}
                >
                    {showMarker && (
                        <MarkerShape roomData={roomData}
                            viewAngle={viewAngle}
                            {...markerPosition}
                            color={'red'} />
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
                    {this.renderCheckBox('Show Marker', 'showMarker')}

                    <div>
                        <label>markerX</label>
                        <input type='range' 
                            value={markerPosition.x} 
                            min={0} 
                            max={roomData.width} 
                            step={10}
                            onChange={(event) => this.setState({ markerPosition: { x: Number(event.target.value), y: markerPosition.y } })} />
                        <span>{markerPosition.x}</span>
                    </div>
                    <div>
                        <label>markerY</label>
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


