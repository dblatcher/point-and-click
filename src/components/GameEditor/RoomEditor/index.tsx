import { Component, h, Fragment } from "preact";
import { BackgroundLayer, RoomData, ScaleLevel, HotspotZone, Zone, SupportedZoneShape, ActorData } from "src";
import { Point } from "../../../lib/pathfinding/geometry";
import { BackgroundLayerControl } from "./BackgroundLayerControl";
import { BackgroundLayerForm } from "./BackgroundLayerForm";
import { ShapeChangeFunction } from "./ShapeControl";
import { HotspotControl } from "./HotspotControl";
import { NumberInput, Warning } from "../formControls";
import { ClickEffect, NewHotspotEffect, NewObstableEffect, NewWalkableEffect } from "./ClickEffect";
import { Preview } from "./Preview";
import { ScalingControl } from "./ScalingControl";
import { cloneData } from "../../../lib/clone";
import { eventToString, listIds } from "../../../lib/util";
import { getShift, locateClickInWorld } from "../../../lib/roomFunctions";
import { TabMenu } from "../../TabMenu";
import { uploadJsonData } from "../../../lib/files";
import styles from '../editorStyles.module.css';
import imageService from "../../../services/imageService";
import { getBlankRoom } from "../defaults";
import { StorageMenu } from "../StorageMenu";
import { RoomDataSchema } from "../../../definitions/RoomData";
import { ListEditor } from "../ListEditor";
import { Entry, Folder, TreeMenu } from "../TreeMenu";
import { ZoneSetEditor } from "./ZoneSetEditor";

type RoomEditorState = RoomData & {
    clickEffect?: ClickEffect;
    mainTab: number;
};

type RoomEditorProps = {
    data?: RoomData;
    updateData?: { (data: RoomData): void };
    existingRoomIds?: string[];
    actors?: ActorData[];
}

const defaultParallax = 1;

function makeNewZone(point: Point, effect: NewObstableEffect | NewWalkableEffect): Zone {

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

export class RoomEditor extends Component<RoomEditorProps, RoomEditorState>{

    constructor(props: RoomEditor['props']) {
        super(props)

        const initialState = props.data ? cloneData(props.data) : getBlankRoom()
        this.state = {
            ...initialState,
            mainTab: 0,
        }

        this.changeProperty = this.changeProperty.bind(this)
        this.addBackground = this.addBackground.bind(this)
        this.changeBackground = this.changeBackground.bind(this)
        this.removeZone = this.removeZone.bind(this)
        this.changeZone = this.changeZone.bind(this)
        this.handleRoomClick = this.handleRoomClick.bind(this)
        this.setClickEffect = this.setClickEffect.bind(this)
        this.handleLoadButton = this.handleLoadButton.bind(this)
        this.handleResetButton = this.handleResetButton.bind(this)
        this.handleUpdateButton = this.handleUpdateButton.bind(this)
        this.handleTreeEntryClick = this.handleTreeEntryClick.bind(this)
    }

    get currentData(): RoomData {
        const roomData = cloneData(this.state) as RoomData & Partial<RoomEditorState>;
        delete roomData.clickEffect
        delete roomData.mainTab
        return roomData
    }

    setClickEffect(clickEffect?: ClickEffect) {
        this.setState({ clickEffect })
    }

    handleRoomClick(pointClicked: { x: number; y: number }, viewAngle: number) {
        const { clickEffect, obstacleAreas = [], hotspots = [], walkableAreas = [] } = this.state
        if (!clickEffect) { return }
        const roundedPoint = {
            x: Math.round(pointClicked.x),
            y: Math.round(pointClicked.y),
        }

        const targetPoint = ['OBSTACLE', 'POLYGON_POINT_OBSTACLE', 'WALKABLE', 'POLYGON_POINT_WALKABLE'].includes(clickEffect.type)
            ? locateClickInWorld(roundedPoint.x, roundedPoint.y, viewAngle, this.state)
            : {
                x: roundedPoint.x - getShift(viewAngle, defaultParallax, this.state),
                y: this.state.height - roundedPoint.y
            }

        const getNextClickEffect = (clickEffect: ClickEffect): ClickEffect | undefined => {
            switch (clickEffect.type) {
                case 'OBSTACLE':
                    return clickEffect.shape === 'polygon' ? { type: 'POLYGON_POINT_OBSTACLE', index: obstacleAreas.length - 1 } : undefined
                case 'WALKABLE':
                    return clickEffect.shape === 'polygon' ? { type: 'POLYGON_POINT_WALKABLE', index: walkableAreas.length - 1 } : undefined
                case 'HOTSPOT':
                    return clickEffect.shape === 'polygon' ? { type: 'POLYGON_POINT_HOTSPOT', index: walkableAreas.length - 1 } : undefined
                default:
                    return clickEffect
            }
        }

        switch (clickEffect.type) {
            case 'OBSTACLE':
                obstacleAreas.push(makeNewZone(targetPoint, clickEffect))
                break;
            case 'WALKABLE':
                walkableAreas.push(makeNewZone(targetPoint, clickEffect))
                break;
            case 'HOTSPOT':
                hotspots.push(this.makeNewHotspot(targetPoint, clickEffect, hotspots.length + 1, viewAngle))
                break;
            case 'POLYGON_POINT_OBSTACLE':
                const obstacle = obstacleAreas[clickEffect.index]
                if (!obstacle?.polygon) { return }
                obstacle.polygon.push([
                    targetPoint.x - obstacle.x, targetPoint.y - obstacle.y
                ])
                break;
            case 'POLYGON_POINT_WALKABLE':
                const walkable = walkableAreas[clickEffect.index]
                if (!walkable?.polygon) { return }
                walkable.polygon.push([
                    targetPoint.x - walkable.x, targetPoint.y - walkable.y
                ])
                break;
            case 'POLYGON_POINT_HOTSPOT':
                const hotspot = hotspots[clickEffect.index]
                if (!hotspot?.polygon) { return }
                hotspot.polygon.push([
                    targetPoint.x - hotspot.x, targetPoint.y - hotspot.y
                ])
                break;
        }

        this.setState({
            hotspots, obstacleAreas, walkableAreas,
            clickEffect: getNextClickEffect(clickEffect),
        })
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

    removeZone(index: number, type?: 'hotspot' | 'obstacle' | 'walkable') {
        const { obstacleAreas = [], hotspots = [], walkableAreas = [] } = this.state
        switch (type) {
            case 'hotspot':
                hotspots.splice(index, 1)
                break;
            case 'obstacle':
                obstacleAreas.splice(index, 1)
                break;
            case 'walkable':
                walkableAreas.splice(index, 1)
                break;
        }
        this.setState({ obstacleAreas, hotspots, walkableAreas })
    }
    changeZone: ShapeChangeFunction = (index, propery, newValue, type) => {

        this.setState(state => {
            const { obstacleAreas = [], hotspots = [], walkableAreas = [] } = state
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
                const zone = type == 'obstacle' ? obstacleAreas[index] : walkableAreas[index]
                handleCommonValues(zone)
                switch (propery) {
                    case 'ref':
                        if (typeof newValue === 'string' || typeof newValue === 'undefined') {
                            zone[propery] = newValue
                        }
                        break;
                    case 'disabled':
                        if (typeof newValue === 'boolean' || typeof newValue === 'undefined') {
                            zone[propery] = newValue
                        }
                        break;
                }
            }
            return { obstacleAreas, hotspots, walkableAreas }
        })
    }

    changeProperty(propery: keyof RoomData, value: unknown): void {
        console.log('change', propery, value)
        const mod: Partial<RoomEditorState> = {}

        switch (propery) {
            case 'background': {
                const result = RoomDataSchema.shape.background.safeParse(value)
                if (result.success) {
                    mod.background = result.data
                }
            }
        }

        this.setState(mod)
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
            case 'imageId':
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
    handleLoadButton = async () => {
        const { data, error } = await uploadJsonData(RoomDataSchema)
        if (data) {
            this.setState(data)
        } else {
            console.warn("NOT ROOM DATA", error)
        }
    }
    handleResetButton() {
        const { props } = this
        const initialState = props.data ? cloneData(props.data) : getBlankRoom()
        this.setState({
            ...initialState
        })
    }
    handleUpdateButton() {
        if (this.props.updateData) {
            this.props.updateData(this.currentData)
        }
    }
    handleTreeEntryClick(folderId: string, data: { id: string }, isForNew: boolean | undefined) {
        console.log(folderId, data, isForNew)

        if (isForNew) {
            switch (folderId) {
                case 'WALKABLE':
                case 'OBSTACLE':
                case 'HOTSPOT':
                    switch (data.id) {
                        case 'rect':
                        case 'polygon':
                        case 'circle':
                            this.setClickEffect({ type: folderId, shape: data.id })
                            break;
                    }
                    break;
            }
        }
    }

    get menuFolders(): Folder[] {
        const { obstacleAreas = [], walkableAreas = [], hotspots = [], background = [], mainTab, clickEffect } = this.state
        const getShape = (zone: Zone): string => zone.polygon ? 'polygon' : zone.circle ? 'circle' : zone.rect ? 'rect' : '??';

        const newZoneEntryisActive = (clickEffectType: ClickEffect["type"], shape: SupportedZoneShape): boolean => {
            return clickEffect?.type === clickEffectType && 'shape' in clickEffect && clickEffect.shape === shape
        }

        const makeNewZoneEntries = (clickEffectType: ClickEffect["type"]) => ([
            { label: 'new circle', isForNew: true, data: { id: 'circle' }, active: newZoneEntryisActive(clickEffectType, 'circle') },
            { label: 'new rect', isForNew: true, data: { id: 'rect' }, active: newZoneEntryisActive(clickEffectType, 'rect') },
            { label: 'new polygon', isForNew: true, data: { id: 'polygon' }, active: newZoneEntryisActive(clickEffectType, 'polygon') },
        ])

        const obstacleEntries: Entry[] = obstacleAreas.map((obstacle, index) => ({
            label: obstacle.ref || `#${index} ${getShape(obstacle)}`,
            data: {
                id: index.toString()
            }
        })).concat(makeNewZoneEntries('OBSTACLE'))

        const walkableEntries: Entry[] = walkableAreas.map((walkable, index) => ({
            label: walkable.ref || `#${index} ${getShape(walkable)}`,
            data: {
                id: index.toString()
            }
        })).concat(makeNewZoneEntries('WALKABLE'))

        const hotspotEntries: Entry[] = hotspots.map((hotspot) => ({
            label: hotspot.id,
            data: hotspot
        }))

        hotspotEntries.push(...makeNewZoneEntries('HOTSPOT'))

        return [
            {
                id: 'scaling',
                open: mainTab === 0,
            },
            {
                id: 'backgrounds',
                label: `backgrounds [${background.length}]`,
                open: mainTab === 1,
            },
            {
                id: 'OBSTACLE',
                label: `obstacles [${obstacleAreas.length}]`,
                open: mainTab === 2,
                entries: obstacleEntries
            },
            {
                id: 'WALKABLE',
                label: `walkables [${walkableAreas.length}]`,
                open: mainTab === 3,
                entries: walkableEntries
            },
            {
                id: 'HOTSPOT',
                label: `hotspots [${hotspots.length}]`,
                open: mainTab === 4,
                entries: hotspotEntries
            },
        ]
    }

    render() {
        const {
            id, background, height, width, frameWidth, obstacleAreas = [], hotspots = [], walkableAreas = [],
            scaling = [],
            clickEffect, mainTab
        } = this.state

        const { existingRoomIds = [], actors = [] } = this.props

        const imageAssets = imageService.getAll().filter(_ => _.category === 'background')

        return <article>
            <h2>Room Editor</h2>

            <div className={styles.rowTopLeft}>
                <fieldset className={styles.fieldset}>
                    <legend>Room</legend>
                    <div className={styles.row}>
                        <label >ID</label>
                        <input type="text" value={id} onInput={event => this.setState({ id: eventToString(event) })} />
                    </div>
                    <div className={styles.row}>
                        <NumberInput label="height" value={height}
                            inputHandler={height => this.setState({ height })} />
                    </div>
                    <div className={styles.row}>
                        <NumberInput label="width" value={width}
                            inputHandler={width => this.setState({ width })} />
                    </div>
                    <div className={styles.row}>
                        <NumberInput label="Frame Width" value={frameWidth}
                            inputHandler={frameWidth => this.setState({ frameWidth })} />
                    </div>
                    {frameWidth > width && (
                        <Warning>frame width is bigger than room width</Warning>
                    )}
                </fieldset>
                <StorageMenu
                    type="room"
                    data={this.currentData}
                    originalId={this.props.data?.id}
                    existingIds={existingRoomIds}
                    reset={this.handleResetButton}
                    update={this.handleUpdateButton}
                    saveButton={true}
                    load={this.handleLoadButton}
                />
            </div>

            <div className={styles.rowTopLeft}>
                <Preview
                    actors={actors}
                    roomData={this.state}
                    clickEffect={clickEffect}
                    handleRoomClick={this.handleRoomClick} />
            </div>

            <div className={styles.container}>
                <section style={{ flexBasis: '10rem' }}>
                    <TreeMenu
                        folders={this.menuFolders}
                        folderClick={(folderId) => {
                            this.setState({ mainTab: listIds(this.menuFolders).indexOf(folderId) })
                        }}
                        entryClick={this.handleTreeEntryClick}
                    />
                </section>

                <section style={{ flexBasis: '20rem' }}>
                    <TabMenu
                        noButtons={true}
                        defaultOpenIndex={mainTab}
                        tabs={[
                            {
                                label: 'Scaling', content: (
                                    <ScalingControl
                                        change={(scaling: ScaleLevel) => { this.setState({ scaling }) }}
                                        scaling={scaling}
                                        height={this.state.height} />
                                )
                            },
                            {
                                label: 'Background', content: (<>
                                    <ListEditor
                                        list={background}
                                        mutateList={(background) => { this.setState({ background }) }}
                                        describeItem={(layer, index) => (
                                            <BackgroundLayerControl index={index}
                                                imageAssets={imageAssets}
                                                layer={layer}
                                                change={this.changeBackground} />
                                        )}
                                    />
                                    <hr />
                                    <BackgroundLayerForm
                                        imageAssets={imageAssets}
                                        addNewLayer={this.addBackground} />
                                </>)
                            },
                            {
                                label: 'Obstacles', content: (
                                    <ZoneSetEditor
                                        zones={obstacleAreas}
                                        type='obstacle'
                                        setClickEffect={this.setClickEffect}
                                        change={this.changeZone}
                                        remove={this.removeZone}
                                    />
                                )
                            },
                            {
                                label: 'Walkables', content: (
                                    <ZoneSetEditor
                                        zones={walkableAreas}
                                        type='walkable'
                                        setClickEffect={this.setClickEffect}
                                        change={this.changeZone}
                                        remove={this.removeZone}
                                    />
                                )
                            },
                            {
                                label: 'Hotspots', content: (
                                    <TabMenu defaultOpenIndex={hotspots.length - 1} tabs={hotspots.map((hotspot, index) => {
                                        return {
                                            label: hotspot.id, content: (
                                                <HotspotControl hotspot={hotspot} index={index}
                                                    setClickEffect={this.setClickEffect}
                                                    change={this.changeZone}
                                                    remove={this.removeZone} />
                                            )
                                        }
                                    })} />
                                )
                            }
                        ]} />
                </section>

            </div>
        </article>
    }
}
