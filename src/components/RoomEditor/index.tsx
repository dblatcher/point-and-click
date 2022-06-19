/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import { BackgroundLayer, RoomData, ScaleLevel } from "../../definitions/RoomData";
import { HotspotZone, Zone } from "../../definitions/Zone";
import { Point } from "../../lib/pathfinding/geometry";
import { BackgroundLayerControl } from "./BackgroundLayerControl";
import { BackgroundLayerForm } from "./BackgroundLayerForm";
import { ZoneControl } from "./ZoneControl";
import { HotspotControl } from "./HotspotControl";
import { NumberInput, Warning } from "../formControls";
import { ClickEffect, NewHotspotEffect, NewObstableEffect } from "./ClickEffect";
import { Preview } from "./Preview";
import { ScalingControl } from "./ScalingControl";
import { cloneData } from "../../lib/clone";
import { isRoomData } from "../../lib/typeguards";
import { eventToNumber, eventToString, getShift, locateClickInWorld } from "../../lib/util";
import { TabMenu } from "../TabMenu";
import { dataToBlob, makeDownloadFile, readJsonFile, uploadFile } from "../../lib/files";
import styles from '../editorStyles.module.css';
import imageService from "../../services/imageService";


type RoomEditorState = RoomData & {
    clickEffect?: ClickEffect;
};

type RoomEditorProps = {
    data?: RoomData;
}

const defaultParallax = 1;

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


function getBlankRoom(): RoomData {
    return {
        name: '_NEW_ROOM',
        frameWidth: 200,
        width: 400,
        height: 200,
        background: [],
        hotspots: [
        ],
        obstacleAreas: [
        ],
        scaling: [
            [0, 1],
        ]
    }
}

export class RoomEditor extends Component<RoomEditorProps, RoomEditorState>{

    constructor(props: RoomEditor['props']) {
        super(props)

        const initialState = props.data ? cloneData(props.data) : getBlankRoom()
        this.state = {
            ...initialState,
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
        this.handleSaveButton = this.handleSaveButton.bind(this)
        this.handleLoadButton = this.handleLoadButton.bind(this)
    }

    setClickEffect(clickEffect?: ClickEffect) {
        this.setState({ clickEffect })
    }

    handleRoomClick(pointClicked: { x: number; y: number }, viewAngle: number) {
        const { clickEffect, obstacleAreas = [], hotspots = [] } = this.state
        if (!clickEffect) { return }
        const roundedPoint = {
            x: Math.round(pointClicked.x),
            y: Math.round(pointClicked.y),
        }

        const targetPoint = clickEffect.type === 'OBSTACLE' || clickEffect.type === 'POLYGON_POINT_OBSTACLE'
            ? locateClickInWorld(roundedPoint.x, roundedPoint.y, viewAngle, this.state)
            : {
                x: roundedPoint.x - getShift(viewAngle, defaultParallax, this.state),
                y: this.state.height - roundedPoint.y
            }

        console.log({ roundedPoint, targetPoint })


        switch (clickEffect.type) {
            case 'OBSTACLE':
                obstacleAreas.push(makeNewZone(targetPoint, clickEffect))
                return this.setState({
                    obstacleAreas,
                    clickEffect: clickEffect.shape === 'polygon' ? { type: 'POLYGON_POINT_OBSTACLE', index: obstacleAreas.length - 1 } : undefined
                })

            case 'HOTSPOT':
                hotspots.push(this.makeNewHotspot(targetPoint, clickEffect, hotspots.length + 1, viewAngle))
                return this.setState({
                    hotspots,
                    clickEffect: clickEffect.shape === 'polygon' ? { type: 'POLYGON_POINT_HOTSPOT', index: hotspots.length - 1 } : undefined
                })

            case 'POLYGON_POINT_OBSTACLE':
                const obstacle = obstacleAreas[clickEffect.index]
                if (!obstacle?.polygon) { return }
                obstacle.polygon.push([
                    targetPoint.x - obstacle.x, targetPoint.y - obstacle.y
                ])
                return this.setState({ obstacleAreas })

            case 'POLYGON_POINT_HOTSPOT':
                const hotspot = hotspots[clickEffect.index]
                if (!hotspot?.polygon) { return }
                hotspot.polygon.push([
                    targetPoint.x - hotspot.x, targetPoint.y - hotspot.y
                ])
                return this.setState({ hotspots })
        }
    }

    makeNewHotspot(point: Point, effect: NewHotspotEffect, idNumber: number, viewAngle: number): HotspotZone {

        const zone: HotspotZone = { ...point, type: 'hotspot', id: `HOTSPOT_${idNumber}`, parallax: defaultParallax }
        switch (effect.shape) {
            case 'circle': zone.circle = 20;
                break;
            case 'rect': zone.rect = [20, 20]
                break;
            case 'polygon': zone.polygon = [[0, 0]]
        }
        return zone
    }

    removeZone(index: number, type?: string) {
        const { obstacleAreas = [], hotspots = [] } = this.state
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
        const { obstacleAreas = [], hotspots = [] } = this.state
        const zone = type === 'hotspot' ? hotspots[index] : obstacleAreas[index]
        zone.x = x
        zone.y = y
        this.setState({ obstacleAreas, hotspots })
    }
    changeZone(index: number, propery: Exclude<keyof HotspotZone, 'type'>, newValue: unknown, type?: string) {
        const { obstacleAreas = [], hotspots = [] } = this.state

        function handleCommonValues(zoneOrHotspot: Zone | HotspotZone) {
            switch (propery) {
                case 'x':
                case 'y':
                case 'circle':
                    if (typeof newValue === 'number') {
                        zoneOrHotspot[propery] = newValue
                    }
                    break;
                case 'path':
                    if (typeof newValue === 'string') {
                        zoneOrHotspot[propery] = newValue
                    }
                    break;
                case 'rect':
                    zoneOrHotspot[propery] = newValue as [number, number]
                    break;
                case 'polygon':
                    zoneOrHotspot[propery] = newValue as [number, number][]
                    break;
            }
        }

        if (type === 'hotspot') {
            const hotspot = hotspots[index]
            handleCommonValues(hotspot)
            switch (propery) {
                case 'parallax':
                    if (typeof newValue === 'number') {
                        hotspot[propery] = newValue
                    }
                    break;
                case 'id':
                case 'name':
                case 'status':
                    if (typeof newValue === 'string') {
                        hotspot[propery] = newValue
                    }
                    break;
            }
        } else {
            const zone = obstacleAreas[index]
            handleCommonValues(zone)
        }
        this.setState({ obstacleAreas, hotspots })
    }
    removeBackground(index: number) {
        const { background } = this.state
        background.splice(index, 1)
        this.setState({ background })
    }
    changeBackground(index: number, propery: keyof BackgroundLayer, newValue: string | number) {
        const { background } = this.state
        const layer = background[index]

        switch (propery) {
            case 'parallax':
                if (typeof newValue === 'number') {
                    layer[propery] = newValue
                }
                break;
            case 'url':
                if (typeof newValue === 'string') {
                    layer[propery] = newValue
                }
                break;
        }

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
    handleSaveButton() {
        const roomData = cloneData(this.state) as RoomEditorState;
        delete roomData.clickEffect

        const blob = dataToBlob(roomData)
        if (blob) {
            makeDownloadFile(`${roomData.name || 'UNNAMED'}.room.json`, blob)
        }
    }
    handleLoadButton = async () => {
        const file = await uploadFile();
        const { data, error } = await readJsonFile(file)

        if (error) {
            console.warn(error)
        }

        if (isRoomData(data)) {
            this.setState(data)
        } else {
            console.warn("NOT ROOM DATA", data)
        }
    }


    render() {
        const {
            name, background, height, width, frameWidth, obstacleAreas = [], hotspots = [],
            scaling = [],
            clickEffect
        } = this.state

        const imageAssets = imageService.getAll().filter(_ => _.category === 'background')

        return <article>
            <h2>Room Editor</h2>

            <div className={styles.container}>
                <section style={{ flexBasis: '20rem' }}>
                    <fieldset className={styles.fieldset}>
                        <legend>name</legend>
                        <input type="text" value={name} onInput={event => this.setState({ name: eventToString(event) })} />
                    </fieldset>
                    <fieldset className={styles.fieldset}>
                        <legend>storage</legend>
                        <div>
                            <button onClick={this.handleSaveButton}>Save to file</button>
                            <button onClick={this.handleLoadButton}>Load from file</button>
                        </div>
                    </fieldset>
                    <TabMenu tabs={[
                        {
                            label: 'Dimensions', content: (
                                <fieldset className={styles.fieldset}>
                                    <legend>Dimensions</legend>
                                    <div className={styles.row}>
                                        <NumberInput label="height" value={height}
                                            onInput={event => this.setState({ height: eventToNumber(event) })} />
                                    </div>
                                    <div className={styles.row}>
                                        <NumberInput label="width" value={width}
                                            onInput={event => this.setState({ width: eventToNumber(event) })} />
                                    </div>
                                    <div className={styles.row}>
                                        <NumberInput label="Frame Width" value={frameWidth}
                                            onInput={event => this.setState({ frameWidth: eventToNumber(event) })} />
                                        {frameWidth > width && (
                                            <Warning>frame width is bigger than room width</Warning>
                                        )}
                                    </div>
                                </fieldset>
                            )
                        },
                        {
                            label: 'Scaling', content: (
                                <fieldset className={styles.fieldset}>
                                    <legend>Scaling</legend>
                                    <ScalingControl
                                        change={(scaling: ScaleLevel) => { this.setState({ scaling }) }}
                                        scaling={scaling}
                                        height={this.state.height} />
                                </fieldset>
                            )
                        },
                        {
                            label: 'Background', content: (
                                <fieldset className={styles.fieldset}>
                                    <legend>Background</legend>
                                    {background.map(
                                        (layer, index) =>
                                            <BackgroundLayerControl index={index}
                                                imageAssets={imageAssets}
                                                layer={layer}
                                                remove={this.removeBackground}
                                                change={this.changeBackground}
                                                move={this.moveBackground}
                                            />
                                    )}

                                    <BackgroundLayerForm
                                        imageAssets={imageAssets}
                                        addNewLayer={this.addBackground} />
                                </fieldset>
                            )
                        },
                        {
                            label: 'Obstacles', content: (
                                <fieldset className={styles.fieldset}>
                                    <legend>Obstacles</legend>
                                    <div>
                                        <button onClick={() => this.setClickEffect({ type: 'OBSTACLE', shape: 'circle' })}>New circle</button>
                                        <button onClick={() => this.setClickEffect({ type: 'OBSTACLE', shape: 'rect' })}>New rect</button>
                                        <button onClick={() => this.setClickEffect({ type: 'OBSTACLE', shape: 'polygon' })}>New polygon</button>
                                    </div>
                                    <hr />
                                    <TabMenu defaultOpenIndex={obstacleAreas.length - 1} tabs={
                                        obstacleAreas.map((obstacle, index) => {
                                            return {
                                                label: `obstacle #${index}`, content: (
                                                    <ZoneControl
                                                        zone={obstacle} index={index}
                                                        setClickEffect={this.setClickEffect}
                                                        move={this.moveZone}
                                                        change={this.changeZone}
                                                        remove={this.removeZone} />
                                                )
                                            }
                                        })
                                    }
                                    />


                                </fieldset>
                            )
                        },
                        {
                            label: 'Hotspots', content: (
                                <fieldset className={styles.fieldset}>
                                    <legend>Hotspots</legend>
                                    <div>
                                        <button onClick={() => this.setClickEffect({ type: 'HOTSPOT', shape: 'circle' })}>New circle</button>
                                        <button onClick={() => this.setClickEffect({ type: 'HOTSPOT', shape: 'rect' })}>New rect</button>
                                        <button onClick={() => this.setClickEffect({ type: 'HOTSPOT', shape: 'polygon' })}>New polygon</button>
                                    </div>
                                    <hr />
                                    <TabMenu defaultOpenIndex={hotspots.length - 1} tabs={hotspots.map((hotspot, index) => {
                                        return {
                                            label: hotspot.id, content: (
                                                <HotspotControl hotspot={hotspot} index={index}
                                                    setClickEffect={this.setClickEffect}
                                                    move={this.moveZone}
                                                    change={this.changeZone}
                                                    remove={this.removeZone} />
                                            )
                                        }
                                    })} />
                                </fieldset>
                            )
                        }
                    ]} />
                </section>

                <Preview
                    roomData={this.state}
                    clickEffect={clickEffect}
                    handleRoomClick={this.handleRoomClick} />

            </div>

        </article>
    }
}
