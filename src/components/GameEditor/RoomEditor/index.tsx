import { HotspotZone, RoomData } from "@/definitions";
import { cloneData } from "@/lib/clone";
import { getShift, locateClickInWorld } from "@/lib/roomFunctions";
import { Stack, Tab, Tabs } from "@mui/material";
import { Component } from "react";
import { EditorHeading } from "../EditorHeading";
import { ItemEditorHeaderControls } from "../ItemEditorHeaderControls";
import { ClickEffect } from "./ClickEffect";
import { DimensionControl } from "./DimensionControl";
import { ScalingControl } from "./ScalingControl";
import { BackgroundControl } from "./background/BackgroundControl";
import { ZoneFeaturesControl } from "./zones/ZoneFeatureControls";
import { makeNewHotspot, makeNewZone } from "./zones/lib";

export type RoomEditorState = {
    activeWalkableIndex?: number;
    activeObstacleIndex?: number;
    activeHotspotIndex?: number;
    tabOpen: number;
};

type RoomEditorProps = {
    updateData: (data: RoomData) => void;
    deleteData: (index: number) => void;
    existingRoomIds: string[];
    data: RoomData;
}

const defaultParallax = 1;


export class RoomEditor extends Component<RoomEditorProps, RoomEditorState>{

    constructor(props: RoomEditor['props']) {
        super(props)

        this.state = {
            activeWalkableIndex: 0,
            activeObstacleIndex: 0,
            activeHotspotIndex: 0,
            tabOpen: 0,
        }

        this.handleRoomClick = this.handleRoomClick.bind(this)
        this.selectZone = this.selectZone.bind(this)
    }

    updateFromPartial(mod: Partial<RoomData>): void {
        this.props.updateData({ ...cloneData(this.props.data), ...mod })
    }

    handleRoomClick(pointClicked: { x: number; y: number }, viewAngle: number, clickEffect: ClickEffect) {
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

        switch (clickEffect.type) {
            case 'OBSTACLE':
                obstacleAreas.push(makeNewZone(targetPoint, clickEffect.shape))
                activeObstacleIndex = obstacleAreas.length - 1;
                break;
            case 'WALKABLE':
                walkableAreas.push(makeNewZone(targetPoint, clickEffect.shape))
                activeWalkableIndex = walkableAreas.length - 1;
                break;
            case 'HOTSPOT':
                hotspots.push(makeNewHotspot(targetPoint, clickEffect, hotspots.length + 1))
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
        })
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

    render() {
        const { tabOpen } = this.state
        const { id } = this.props.data

        return <Stack component={'article'} spacing={1} height={'100%'} marginBottom={2}>
            <EditorHeading heading="Room Editor" helpTopic="rooms" itemId={id} >
                <ItemEditorHeaderControls
                    dataItem={this.props.data}
                    itemType="rooms"
                    itemTypeName="room"
                />
            </EditorHeading>

            <Tabs value={tabOpen} onChange={(event, tabOpen) => this.setState({ tabOpen })}>
                <Tab label="Background and dimensions" value={0} />
                <Tab label="Features" value={1} />
                <Tab label="Sprite Scaling" value={2} />
            </Tabs>

            {tabOpen === 0 && (
                <>
                    <DimensionControl room={this.props.data} />
                    <BackgroundControl room={this.props.data} />
                </>
            )}

            {tabOpen === 1 && (
                <ZoneFeaturesControl room={this.props.data}
                    handleRoomClick={this.handleRoomClick}
                    selectZone={this.selectZone}
                    activeHotspotIndex={this.state.activeHotspotIndex}
                    activeObstacleIndex={this.state.activeObstacleIndex}
                    activeWalkableIndex={this.state.activeWalkableIndex}
                />
            )}

            {tabOpen === 2 && (
                <ScalingControl room={this.props.data} />
            )}
        </Stack>
    }
}
