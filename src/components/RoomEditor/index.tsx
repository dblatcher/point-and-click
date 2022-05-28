import { Component } from "preact";
import { BackgroundLayer, RoomData, ScaleLevel } from "../../definitions/RoomData";
import { HotspotZone, SupportedZoneShape, Zone } from "../../definitions/Zone";
import { Point } from "../../lib/pathfinding/geometry";
import { BackgroundLayerControl } from "./BackgroundLayerControl";
import { BackgroundLayerForm } from "./BackgroundLayerForm";
import { ZoneControl } from "./ZoneControl";
import styles from './styles.module.css';
import { HotspotControl } from "./HotspotControl";
import { NumberInput, Warning } from "../formControls";
import { ClickEffect, NewHotspotEffect, NewObstableEffect } from "./ClickEffect";
import { Preview } from "./Preview";
import { ScalingControl } from "./ScalingControl";


type RoomEditorState = RoomData & {
    assetList: string[];
    clickEffect?: ClickEffect;
};

function makeNewHotspot(point: Point, effect: NewHotspotEffect): HotspotZone {

    const zone: HotspotZone = { x: point.x, y: point.y, type: 'hotspot', id: 'NEW_ID', parallax: 1 }
    switch (effect.shape) {
        case 'circle': zone.circle = 20;
            break;
        case 'rect': zone.rect = [20, 20]
            break;
        case 'polygon': zone.polygon = [[0, 0]]
    }
    return zone
}

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
        scaling: [
            [0, 1],
        ]
    }
}

export class RoomEditor extends Component<{}, RoomEditorState>{

    constructor(props: RoomEditor['props']) {
        super(props)
        const assets = getAssets()

        this.state = {
            ...getBlankRoom(),
            assetList: assets,
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

    handleRoomClick(pointClicked: { x: number, y: number }) {
        const { clickEffect, obstacleAreas, hotspots } = this.state
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

            case 'HOTSPOT':
                hotspots.push(makeNewHotspot(roundedPoint, clickEffect))
                return this.setState({
                    hotspots,
                    clickEffect: clickEffect.shape === 'polygon' ? { type: 'POLYGON_POINT_HOTSPOT', index: hotspots.length - 1 } : undefined
                })

            case 'POLYGON_POINT_OBSTACLE':
                const obstacle = obstacleAreas[clickEffect.index]
                if (!obstacle?.polygon) { return }
                obstacle.polygon.push([
                    roundedPoint.x - obstacle.x, roundedPoint.y - obstacle.y
                ])
                return this.setState({ obstacleAreas })

            case 'POLYGON_POINT_HOTSPOT':
                const hotspot = hotspots[clickEffect.index]
                if (!hotspot?.polygon) { return }
                hotspot.polygon.push([
                    roundedPoint.x - hotspot.x, roundedPoint.y - hotspot.y
                ])
                return this.setState({ hotspots })
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
    changeZone(index: number, propery: Exclude<keyof HotspotZone, ('type' & SupportedZoneShape)>, newValue: any, type?: string) {
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
        const { assetList,
            name, background, height, width, frameWidth, obstacleAreas, hotspots = [],
            scaling = [],
            clickEffect
        } = this.state

        return <article>
            <h2>Room Editor</h2>

            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <section style={{ flexBasis: '20rem' }}>
                    <fieldset className={styles.fieldset}>
                        <legend>name</legend>
                        <input type="text" value={name} onInput={event => this.setState({ name: event.target.value })} />
                    </fieldset>

                    <fieldset className={styles.fieldset}>
                        <legend>Dimensions</legend>
                        <div className={styles.row}>
                            <NumberInput label="height" value={height}
                                onInput={event => this.setState({ height: Number(event.target.value) })} />
                        </div>
                        <div className={styles.row}>
                            <NumberInput label="width" value={width}
                                onInput={event => this.setState({ width: Number(event.target.value) })} />
                        </div>
                        <div className={styles.row}>
                            <NumberInput label="Frame Width" value={frameWidth}
                                onInput={event => this.setState({ frameWidth: Number(event.target.value) })} />
                            {frameWidth > width && (
                                <Warning>frame width is bigger than room width</Warning>
                            )}
                        </div>
                    </fieldset>
                    <fieldset className={styles.fieldset}>
                        <legend>Scaling</legend>
                        <ScalingControl
                            change={(scaling: ScaleLevel) => { this.setState({ scaling }) }}
                            scaling={scaling}
                            height={this.state.height} />
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
                        {hotspots.map((hotspot, index) =>
                            <HotspotControl hotspot={hotspot} index={index}
                                setClickEffect={this.setClickEffect}
                                move={this.moveZone}
                                change={this.changeZone}
                                remove={this.removeZone} />

                        )}
                        <div>
                            <button onClick={() => this.setClickEffect({ type: 'HOTSPOT', shape: 'circle' })}>New circle</button>
                            <button onClick={() => this.setClickEffect({ type: 'HOTSPOT', shape: 'rect' })}>New rect</button>
                            <button onClick={() => this.setClickEffect({ type: 'HOTSPOT', shape: 'polygon' })}>New polygon</button>
                        </div>
                    </fieldset>
                </section>

                <Preview
                    roomData={this.state}
                    clickEffect={clickEffect}
                    handleRoomClick={this.handleRoomClick} />
            </div>

        </article>
    }
}


