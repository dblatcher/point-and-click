import { ActorData, HotspotZone, RoomData, ScaleLevel, Zone } from "@/definitions";
import { RoomDataSchema } from "@/definitions/RoomData";
import { cloneData } from "@/lib/clone";
import { Point } from "@/lib/pathfinding/geometry";
import { getShift, locateClickInWorld } from "@/lib/roomFunctions";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { Component, ReactNode } from "react";
import { AccoridanedContent } from "../AccordianedContent";
import { EditorHeading } from "../EditorHeading";
import { ItemEditorHeaderControls } from "../ItemEditorHeaderControls";
import { ClickEffect, NewHotspotEffect, NewObstableEffect, NewWalkableEffect } from "./ClickEffect";
import { DimensionControl } from "./DimensionControl";
import { HotspotSetEditor } from "./HotspotSetEditor";
import { Preview } from "./Preview";
import { ScalingControl } from "./ScalingControl";
import { ShapeChangeFunction } from "./ShapeControl";
import { ZoneSetEditor } from "./ZoneSetEditor";
import { BackgroundControl } from "./background/BackgroundControl";

export type RoomEditorState = {
    clickEffect?: ClickEffect;
    activeWalkableIndex?: number;
    activeObstacleIndex?: number;
    activeHotspotIndex?: number;
};

type RoomEditorProps = {
    updateData: (data: RoomData) => void;
    deleteData: (index: number) => void;
    existingRoomIds: string[];
    actors?: ActorData[];
    data: RoomData;
}

interface TabbedContent {
    label: string;
    content: ReactNode;
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

        this.state = {
            activeWalkableIndex: 0,
            activeObstacleIndex: 0,
            activeHotspotIndex: 0,
        }

        this.changeProperty = this.changeProperty.bind(this)
        this.removeZone = this.removeZone.bind(this)
        this.changeZone = this.changeZone.bind(this)
        this.handleRoomClick = this.handleRoomClick.bind(this)
        this.setClickEffect = this.setClickEffect.bind(this)
        this.selectZone = this.selectZone.bind(this)
    }

    updateFromPartial(mod: Partial<RoomData>): void {
        this.props.updateData({ ...cloneData(this.props.data), ...mod })
    }

    setClickEffect(clickEffect?: ClickEffect) {
        this.setState({ clickEffect })
    }

    handleRoomClick(pointClicked: { x: number; y: number }, viewAngle: number) {
        const {
            clickEffect,
        } = this.state
        const {
            obstacleAreas = [], hotspots = [], walkableAreas = []
        } = this.props.data
        let {
            activeHotspotIndex, activeObstacleIndex, activeWalkableIndex,
        } = this.state
        if (!clickEffect) { return }
        const roundedPoint = {
            x: Math.round(pointClicked.x),
            y: Math.round(pointClicked.y),
        }

        const targetPoint = [
            'OBSTACLE', 'POLYGON_POINT_OBSTACLE', 'WALKABLE', 'POLYGON_POINT_WALKABLE', 'HOTSPOT_WALKTO_POINT'
        ].includes(clickEffect.type)
            ? locateClickInWorld(roundedPoint.x, roundedPoint.y, viewAngle, this.props.data)
            : {
                x: roundedPoint.x - getShift(viewAngle, defaultParallax, this.props.data),
                y: this.props.data.height - roundedPoint.y
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
                activeObstacleIndex = obstacleAreas.length - 1;
                break;
            case 'WALKABLE':
                walkableAreas.push(makeNewZone(targetPoint, clickEffect))
                activeWalkableIndex = walkableAreas.length - 1;
                break;
            case 'HOTSPOT':
                hotspots.push(this.makeNewHotspot(targetPoint, clickEffect, hotspots.length + 1, viewAngle))
                activeHotspotIndex = hotspots.length - 1;
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

        this.updateFromPartial({
            hotspots, obstacleAreas, walkableAreas,
        })
        this.setState({
            activeHotspotIndex, activeObstacleIndex, activeWalkableIndex,
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
        const { obstacleAreas = [], hotspots = [], walkableAreas = [] } = this.props.data
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
        this.updateFromPartial({ obstacleAreas, hotspots, walkableAreas })
    }

    changeZone: ShapeChangeFunction = (index, propery, newValue, type) => {
        const getMod = () => {
            const { obstacleAreas = [], hotspots = [], walkableAreas = [] } = this.props.data
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
        }
        this.updateFromPartial(getMod())
    }

    changeProperty(propery: keyof RoomData, value: unknown): void {
        console.log('change', propery, value)
        const mod: Partial<RoomData> = {}

        switch (propery) {
            case 'background': {
                const result = RoomDataSchema.shape.background.safeParse(value)
                if (result.success) {
                    mod.background = result.data
                }
            }
        }
        this.updateFromPartial(mod)
    }

    selectZone(folderId: string, data?: { id: string }) {
        switch (folderId) {
            case 'WALKABLE': {
                if (!data) {
                    return this.setState({ 'activeWalkableIndex': undefined })
                }
                const zoneIndex = Number(data.id)
                if (isNaN(zoneIndex)) { return }
                this.setState({ 'activeWalkableIndex': zoneIndex })
                break;
            }
            case 'OBSTACLE': {
                if (!data) {
                    return this.setState({ 'activeObstacleIndex': undefined })
                }
                const zoneIndex = Number(data.id)
                if (isNaN(zoneIndex)) { return }
                this.setState({ 'activeObstacleIndex': zoneIndex })
                break;
            }
            case 'HOTSPOT':
                if (!data) {
                    return this.setState({ 'activeHotspotIndex': undefined })
                }
                const zoneIndex = this.props.data.hotspots?.indexOf(data as HotspotZone) || 0
                this.setState({ 'activeHotspotIndex': zoneIndex })
                break;
        }
    }

    buildTabs(): TabbedContent[] {
        const {
            obstacleAreas = [], hotspots = [], walkableAreas = [],
            scaling = [],
        } = this.props.data

        return [
            {
                label: 'Sprite Scaling', content: (
                    <Container maxWidth="sm">
                        <Box paddingBottom={2}>
                            <Typography variant="overline" component={'label'}>Sprite Scaling</Typography>
                            <ScalingControl
                                change={(scaling: ScaleLevel) => { this.updateFromPartial({ scaling }) }}
                                scaling={scaling}
                                height={this.props.data.height} />
                        </Box>
                    </Container>
                )
            },
            {
                label: 'Hotspots', content: (
                    <HotspotSetEditor
                        hotspots={hotspots}
                        openIndex={this.state.activeHotspotIndex}
                        changeZone={this.changeZone}
                        selectZone={this.selectZone}
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
                        activeZoneIndex={this.state.activeObstacleIndex}
                        selectZone={this.selectZone}
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
                        activeZoneIndex={this.state.activeWalkableIndex}
                        selectZone={this.selectZone}
                        clickEffect={this.state.clickEffect}
                    />
                )
            },
        ]

    }

    render() {
        const { clickEffect } = this.state
        const { id } = this.props.data
        const { actors = [] } = this.props
        const tabs = this.buildTabs()

        return <Stack component={'article'} spacing={1} height={'100%'} marginBottom={2}>
            <EditorHeading heading="Room Editor" helpTopic="rooms" itemId={id} >
                <ItemEditorHeaderControls
                    dataItem={this.props.data}
                    itemType="rooms"
                    itemTypeName="room"
                />
            </EditorHeading>

            <DimensionControl room={this.props.data} />
            <BackgroundControl room={this.props.data} />

            <Grid container flexWrap={'nowrap'} spacing={1}>
                <Grid item xs={4}>
                    <AccoridanedContent tabs={tabs} />
                </Grid>
                <Grid item flex={1}>
                    <div style={{ position: 'sticky', top: 1 }}>
                        <Preview
                            actors={actors}
                            roomData={this.props.data}
                            clickEffect={clickEffect}
                            activeHotspotIndex={this.state.activeHotspotIndex}
                            handleRoomClick={this.handleRoomClick} />
                    </div>
                </Grid>
            </Grid>
        </Stack>
    }
}
