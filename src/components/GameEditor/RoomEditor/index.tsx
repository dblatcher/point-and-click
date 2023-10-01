import { ActorData, BackgroundLayer, HotspotZone, RoomData, ScaleLevel, Zone } from "@/definitions";
import { RoomDataSchema } from "@/definitions/RoomData";
import imageService from "@/services/imageService";
import { Alert, Container, Grid, Stack } from "@mui/material";
import { Component } from "react";
import { higherLevelSetStateWithAutosave, type DataItemEditorProps, type EnhancedSetStateFunction } from "../dataEditors";
import { getBlankRoom } from "../defaults";
import { ClickEffect, NewHotspotEffect, NewObstableEffect, NewWalkableEffect } from "./ClickEffect";
// lib
import { cloneData } from "@/lib/clone";
import { uploadJsonData } from "@/lib/files";
import { Point } from "@/lib/pathfinding/geometry";
import { getShift, locateClickInWorld } from "@/lib/roomFunctions";
// components
import { type TabSetItem } from "@/components/GameEditor/TabSet";
import { AccoridanedContent } from "../AccordianedContent";
import { EditorHeading } from "../EditorHeading";
import { StorageMenu } from "../StorageMenu";
// subcomponents
import { SchemaForm, getModification } from "@/components/SchemaForm";
import { StringInput } from "@/components/SchemaForm/StringInput";
import { ArrayControl } from "../ArrayControl";
import { BackgroundLayerControl } from "./BackgroundLayerControl";
import { BackgroundLayerForm } from "./BackgroundLayerForm";
import { HotspotPicker } from "./HotspotPicker";
import { Preview } from "./Preview";
import { ScalingControl } from "./ScalingControl";
import { ShapeChangeFunction } from "./ShapeControl";
import { ZoneSetEditor } from "./ZoneSetEditor";

export type RoomEditorState = RoomData & {
    clickEffect?: ClickEffect;
    mainTab: number;
    walkableTab: number;
    obstableTab: number;
    hotspotTab: number;
};

type RoomEditorProps = DataItemEditorProps<RoomData> & {
    existingRoomIds: string[];
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

    setStateWithAutosave: EnhancedSetStateFunction<RoomEditorState>

    constructor(props: RoomEditor['props']) {
        super(props)

        const initialState = props.data ? cloneData(props.data) : getBlankRoom()
        this.state = {
            ...initialState,
            mainTab: 0,
            walkableTab: 0,
            obstableTab: 0,
            hotspotTab: 0,
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
        this.setStateWithAutosave = higherLevelSetStateWithAutosave(this).bind(this)
    }

    get currentData(): RoomData {
        const roomData = cloneData(this.state) as RoomData & Partial<RoomEditorState>;
        delete roomData.clickEffect
        delete roomData.mainTab
        delete roomData.obstableTab
        delete roomData.walkableTab
        delete roomData.hotspotTab
        return roomData
    }

    get existingIds(): string[] {
        return this.props.existingRoomIds
    }

    setClickEffect(clickEffect?: ClickEffect) {
        this.setState({ clickEffect })
    }

    handleRoomClick(pointClicked: { x: number; y: number }, viewAngle: number) {
        const {
            clickEffect,
            obstacleAreas = [], hotspots = [], walkableAreas = []
        } = this.state
        let {
            hotspotTab, obstableTab, walkableTab,
        } = this.state
        if (!clickEffect) { return }
        const roundedPoint = {
            x: Math.round(pointClicked.x),
            y: Math.round(pointClicked.y),
        }

        const targetPoint = [
            'OBSTACLE', 'POLYGON_POINT_OBSTACLE', 'WALKABLE', 'POLYGON_POINT_WALKABLE', 'HOTSPOT_WALKTO_POINT'
        ].includes(clickEffect.type)
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
                    return clickEffect.shape === 'polygon' ? { type: 'POLYGON_POINT_HOTSPOT', index: hotspots.length - 1 } : undefined
                default:
                    return clickEffect
            }
        }

        switch (clickEffect.type) {
            case 'OBSTACLE':
                obstacleAreas.push(makeNewZone(targetPoint, clickEffect))
                obstableTab = obstacleAreas.length - 1;
                break;
            case 'WALKABLE':
                walkableAreas.push(makeNewZone(targetPoint, clickEffect))
                walkableTab = walkableAreas.length - 1;
                break;
            case 'HOTSPOT':
                hotspots.push(this.makeNewHotspot(targetPoint, clickEffect, hotspots.length + 1, viewAngle))
                hotspotTab = hotspots.length - 1;
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
            case 'POLYGON_POINT_HOTSPOT': {
                const hotspot = hotspots[clickEffect.index]
                if (!hotspot?.polygon) { return }
                hotspot.polygon.push([
                    targetPoint.x - hotspot.x, targetPoint.y - hotspot.y
                ])
                break;
            }
            case 'HOTSPOT_WALKTO_POINT': {
                const hotspot = hotspots[clickEffect.index]
                console.log(hotspot, targetPoint)
                hotspot.walkToX = targetPoint.x
                hotspot.walkToY = targetPoint.y
                break;
            }
        }

        this.setStateWithAutosave({
            hotspots, obstacleAreas, walkableAreas,
            hotspotTab, obstableTab, walkableTab,
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
        this.setStateWithAutosave({ obstacleAreas, hotspots, walkableAreas })
    }

    changeZone: ShapeChangeFunction = (index, propery, newValue, type) => {
        this.setStateWithAutosave(state => {
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
                    case 'walkToX':
                    case 'walkToY':
                        if (typeof newValue === 'number' || typeof newValue === 'undefined') {
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
        this.setStateWithAutosave(mod)
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

        this.setStateWithAutosave({ background })
    }
    addBackground(newLayer: BackgroundLayer) {
        const { background } = this.state
        background.push(newLayer)
        this.setStateWithAutosave({ background })
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
        } else {
            switch (folderId) {
                case 'WALKABLE': {
                    const zoneIndex = Number(data.id)
                    if (isNaN(zoneIndex)) { return }
                    this.setState({ 'walkableTab': zoneIndex })
                    break;
                }
                case 'OBSTACLE': {
                    const zoneIndex = Number(data.id)
                    if (isNaN(zoneIndex)) { return }
                    this.setState({ 'obstableTab': zoneIndex })
                    break;
                }
                case 'HOTSPOT':
                    const zoneIndex = this.state.hotspots?.indexOf(data as HotspotZone) || 0
                    this.setState({ 'hotspotTab': zoneIndex })
                    break;
            }
        }
    }

    buildTabs(): TabSetItem[] {
        const {
            background, obstacleAreas = [], hotspots = [], walkableAreas = [],
            scaling = [],
            width, frameWidth,
        } = this.state
        const { existingRoomIds = [], options, deleteData } = this.props
        const imageAssets = imageService.getAll().filter(_ => _.category === 'background')

        return [
            {
                label: 'Room', content: (
                    <Container maxWidth="sm">
                        <SchemaForm
                            schema={RoomDataSchema.pick({
                                id: true,
                                height: true,
                                width: true,
                                frameWidth: true,
                            })}
                            data={this.state}
                            changeValue={(value, fieldDef,) => {
                                this.setStateWithAutosave(
                                    getModification(value, fieldDef)
                                )
                            }}
                        />
                        {frameWidth > width && (
                            <Alert severity="warning">frame width is bigger than room width</Alert>
                        )}

                        <StringInput label="backdrop color"
                            type="color"
                            value={this.state.backgroundColor ?? '#ffffff'}
                            optional
                            inputHandler={value => this.setStateWithAutosave({ backgroundColor: value })} />
                    </Container>
                )
            },
            {
                label: 'Scaling', content: (
                    <ScalingControl
                        change={(scaling: ScaleLevel) => { this.setStateWithAutosave({ scaling }) }}
                        scaling={scaling}
                        height={this.state.height} />
                )
            },
            {
                label: 'Background', content: (<Stack spacing={2}>
                    <ArrayControl
                        list={background}
                        buttonSize="small"
                        mutateList={(background) => { this.setStateWithAutosave({ background }) }}
                        describeItem={(layer, index) => (
                            <BackgroundLayerControl index={index}
                                imageAssets={imageAssets}
                                layer={layer}
                                change={this.changeBackground} />
                        )}
                    />
                    <BackgroundLayerForm
                        imageAssets={imageAssets}
                        addNewLayer={this.addBackground} />
                </Stack>)
            },
            {
                label: 'Hotspots', content: (
                    <HotspotPicker
                        hotspots={hotspots}
                        openIndex={this.state.hotspotTab}
                        changeZone={this.changeZone}
                        selectZone={this.handleTreeEntryClick}
                        removeZone={this.removeZone}
                        clickEffect={this.state.clickEffect}
                        setClickEffect={this.setClickEffect}
                    />
                )
            },
            {
                label: 'Obstacles', content: (
                    <ZoneSetEditor
                        zones={obstacleAreas}
                        type='obstacle'
                        setClickEffect={this.setClickEffect}
                        change={this.changeZone}
                        remove={this.removeZone}
                        openTab={this.state.obstableTab}
                        selectZone={this.handleTreeEntryClick}
                        clickEffect={this.state.clickEffect}
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
                        openTab={this.state.walkableTab}
                        selectZone={this.handleTreeEntryClick}
                        clickEffect={this.state.clickEffect}
                    />
                )
            },

            {
                label: 'storage', content: (
                    <Container maxWidth="xs">
                        <StorageMenu
                            type="room"
                            data={this.currentData}
                            originalId={this.props.data?.id}
                            existingIds={existingRoomIds}
                            reset={this.handleResetButton}
                            update={this.handleUpdateButton}
                            deleteItem={deleteData}
                            saveButton={true}
                            load={this.handleLoadButton}
                            options={options}
                        />
                    </Container>
                )
            }
        ]

    }

    render() {
        const { id, clickEffect } = this.state
        const { actors = [] } = this.props
        const tabs = this.buildTabs()

        return <Stack component={'article'} spacing={1} height={'100%'} marginBottom={2}>
            <EditorHeading heading="Room Editor" helpTopic="rooms" itemId={id} />

            <Grid container>
                <Grid item xs={4}>
                    <AccoridanedContent tabs={tabs} />
                </Grid>
                <Grid item>
                    <div style={{ position: 'sticky', top: 1 }}>
                        <Preview
                            actors={actors}
                            roomData={this.state}
                            clickEffect={clickEffect}
                            activeHotspotIndex={this.state.mainTab == 4 ? this.state.hotspotTab : undefined}
                            handleRoomClick={this.handleRoomClick} />
                    </div>
                </Grid>
            </Grid>
        </Stack>
    }
}
