import { Component } from "preact";
import { BackgroundLayer, RoomData } from "../../definitions/RoomData";
import { HotSpotZone, SupportedZoneShape, Zone } from "../../definitions/Zone";
import { Point } from "../../lib/pathfinding/geometry";
import { locateClickInWorld } from "../../lib/util";
import { Room } from "../Room";
import { BackgroundLayerControl } from "./BackgroundLayerControl";
import { BackgroundLayerForm } from "./BackgroundLayerForm";
import { ZoneControl } from "./ZoneControl";
import styles from './styles.module.css';
import { HotSpotControl } from "./HotSpotControl";

type NewObstableEffect = {
    type: 'OBSTACLE',
    shape: SupportedZoneShape
}

export type NewObstaclePolygonPointEffect = {
    type: 'POLYGON_POINT_OBSTACLE';
    index: number;
}

export type ClickEffect = NewObstableEffect | NewObstaclePolygonPointEffect

type RoomEditorState = RoomData & {
    viewAngle: number;
    assetList: string[];
    viewScale: number;
    showObstacleAreas: boolean;
    clickEffect?: ClickEffect;
};

function makeNewZone(point: Point, effect: NewObstableEffect): Zone {

    const zone: Zone = { x: point.x, y: point.y }
    switch (effect.shape) {
        case 'circle': zone.circle = 20;
            break;
        case 'rect': zone.rect = [20, 20]
            break;
        case 'polygon': zone.polygon = [[0, 0]]
    }
    return zone
}


const path = "/assets/backgrounds/"
function getAssets(): string[] {
    return [
        "square-room.png",
        "hill.png",
        "indoors.png",
        "sky.png",
        "trees.png",
    ].map(filename => path + filename)
}

function getBlankRoom(): RoomData {
    return {
        name: '_NEW_',
        frameWidth: 400,
        width: 400,
        height: 200,
        background: [],
        hotspots: [
            { x: 40, y: 40, type: 'hotspot', 'circle': 30, parallax: 1, id: 'THING_ONE', name: 'thing' }
        ],
        obstacleAreas: [
        ],
    }
}

export class RoomEditor extends Component<{}, RoomEditorState>{

    constructor(props: RoomEditor['props']) {
        super(props)
        const assets = getAssets()

        this.state = {
            ...getBlankRoom(),
            viewAngle: 0,
            viewScale: 1,
            assetList: assets,
            showObstacleAreas: true,
        }

        this.removeBackground = this.removeBackground.bind(this)
        this.addBackground = this.addBackground.bind(this)
        this.changeBackground = this.changeBackground.bind(this)
        this.moveBackground = this.moveBackground.bind(this)
        this.removeZone = this.removeZone.bind(this)
        this.moveZone = this.moveZone.bind(this)
        this.changeZone = this.changeZone.bind(this)
        this.handleRoomClick = this.handleRoomClick.bind(this)
        this.setClickEffect = this.setClickEffect.bind(this)
    }

    setClickEffect(clickEffect?: ClickEffect) {
        this.setState({ clickEffect })
    }

    handleRoomClick(x: number, y: number) {
        const { clickEffect, obstacleAreas } = this.state
        const pointClicked = locateClickInWorld(x, y, this.state.viewAngle, this.state)
        const roundedPoint = {
            x: Math.round(pointClicked.x),
            y: Math.round(pointClicked.y),
        }

        if (!clickEffect) { return }

        switch (clickEffect.type) {
            case 'OBSTACLE':
                obstacleAreas.push(makeNewZone(roundedPoint, clickEffect))
                return this.setState({
                    obstacleAreas,
                    clickEffect: clickEffect.shape === 'polygon' ? { type: 'POLYGON_POINT_OBSTACLE', index: obstacleAreas.length - 1 } : undefined
                })

            case 'POLYGON_POINT_OBSTACLE':
                const obstacle = obstacleAreas[clickEffect.index]
                if (!obstacle?.polygon) { return }
                obstacle.polygon.push([
                    roundedPoint.x - obstacle.x, roundedPoint.y - obstacle.y
                ])
                return this.setState({ obstacleAreas })
        }
    }

    removeZone(index: number, type?: string) {
        const { obstacleAreas, hotspots } = this.state
        switch (type) {
            case 'hotspot':
                hotspots.splice(index, 1)
                break;
            default:
                obstacleAreas.splice(index, 1)
        }
        this.setState({ obstacleAreas, hotspots })
    }
    moveZone(index: number, x: number, y: number, type?: string) {
        const { obstacleAreas, hotspots } = this.state
        const zone = type === 'hotspot' ? hotspots[index] : obstacleAreas[index]
        zone.x = x
        zone.y = y
        this.setState({ obstacleAreas, hotspots })
    }
    changeZone(index: number, propery: Exclude<keyof HotSpotZone, ('type' & SupportedZoneShape)>, newValue: any, type?: string) {
        console.log(index, propery, newValue, type)
        const { obstacleAreas, hotspots } = this.state
        const zone = type === 'hotspot' ? hotspots[index] : obstacleAreas[index]
        if (typeof zone[propery] === 'undefined') { return }
        zone[propery] = newValue
        this.setState({ obstacleAreas, hotspots })
    }
    removeBackground(index: number) {
        const { background } = this.state
        background.splice(index, 1)
        this.setState({ background })
    }
    changeBackground(index: number, propery: string, newValue: any) {
        const { background } = this.state
        const layer = background[index]
        if (typeof layer[propery] === 'undefined') { return }
        layer[propery] = newValue
        this.setState({ background })
    }
    addBackground(newLayer: BackgroundLayer) {
        const { background } = this.state
        background.push(newLayer)
        this.setState({ background })
    }
    moveBackground(index: number, direction: 'UP' | 'DOWN') {
        const { background } = this.state
        if (direction === 'UP' && index === 0) { return }
        if (direction === 'DOWN' && index === background.length - 1) { return }
        const [layer] = background.splice(index, 1)
        background.splice(direction === 'DOWN' ? index + 1 : index - 1, 0, layer)
        this.setState({ background })
    }

    render() {
        const { viewAngle, viewScale, assetList, showObstacleAreas,
            name, background, height, width, frameWidth, obstacleAreas, hotspots = [],
            clickEffect
        } = this.state

        return <article>
            <h2>Room Editor</h2>

            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <section style={{ flexBasis: '20rem' }}>
                    <fieldset className={styles.fieldset}>
                        <legend>name</legend>
                        <input value={name} onInput={event => this.setState({ name: event.target.value })} />
                    </fieldset>

                    <fieldset className={styles.fieldset}>
                        <legend>Dimensions</legend>
                        <div>
                            <label>height</label>
                            <input type='number' value={height} 
                            onInput={event => this.setState({ height: Number(event.target.value) })} />
                        </div>
                        <div>
                            <label>width</label>
                            <input type='number' value={width} 
                            onInput={event => this.setState({ width: Number(event.target.value) })} />
                        </div>
                        <div>
                            <label>frameWidth</label>
                            <input type='number' value={frameWidth} 
                            onInput={event => this.setState({ frameWidth: Number(event.target.value) })} />
                            {frameWidth > width && (
                                <span>! frame width is bigger than room width</span>
                            )}
                        </div>
                    </fieldset>

                    <fieldset className={styles.fieldset}>
                        <legend>Background</legend>

                        {background.map(
                            (layer, index) =>
                                <BackgroundLayerControl index={index}
                                    urls={assetList}
                                    layer={layer}
                                    remove={this.removeBackground}
                                    change={this.changeBackground}
                                    move={this.moveBackground}
                                />
                        )}

                        <BackgroundLayerForm
                            urls={assetList}
                            addNewLayer={this.addBackground} />
                    </fieldset>
                    <fieldset className={styles.fieldset}>
                        <legend>Obstacles</legend>
                        {obstacleAreas.map((obstacle, index) =>
                            <ZoneControl
                                zone={obstacle} index={index}
                                setClickEffect={this.setClickEffect}
                                move={this.moveZone}
                                change={this.changeZone}
                                remove={this.removeZone} />
                        )}
                        <div>
                            <button onClick={() => this.setClickEffect({ type: 'OBSTACLE', shape: 'circle' })}>New circle</button>
                            <button onClick={() => this.setClickEffect({ type: 'OBSTACLE', shape: 'rect' })}>New rect</button>
                            <button onClick={() => this.setClickEffect({ type: 'OBSTACLE', shape: 'polygon' })}>New polygon</button>
                        </div>
                    </fieldset>
                    <fieldset className={styles.fieldset}>
                        <legend>Hotspots</legend>
                        {hotspots.map((hotSpot, index) =>
                            <>
                                <HotSpotControl hotSpot={hotSpot} index={index}
                                    change={this.changeZone}
                                />
                                <ZoneControl
                                    zone={hotSpot} index={index}
                                    setClickEffect={this.setClickEffect}
                                    move={this.moveZone}
                                    change={this.changeZone}
                                    remove={this.removeZone} />
                            </>
                        )}
                        <div>
                        </div>
                    </fieldset>
                </section>

                <section>
                    <p>
                        &nbsp;
                        {clickEffect?.type === 'OBSTACLE' && (
                            <span>Click to add new {clickEffect.shape} obstable</span>
                        )}
                        {clickEffect?.type === 'POLYGON_POINT_OBSTACLE' && (
                            <span>Click to add new point </span>
                        )}
                    </p>
                    <Room data={this.state}
                        showObstacleAreas={showObstacleAreas}
                        scale={viewScale}
                        viewAngle={viewAngle}
                        handleHotSpotClick={() => { }}
                        handleRoomClick={this.handleRoomClick}
                    />

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
                    <div>
                        <label>show obstables</label>
                        <input type='checkbox' checked={showObstacleAreas} 
                            onChange={(event) => this.setState({ showObstacleAreas: event.target.checked })} />
                        <span>{showObstacleAreas ? 'YES' : 'NO'}</span>
                    </div>
                </section>
            </div>

        </article>
    }
}


