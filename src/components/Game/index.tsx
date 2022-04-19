import { Component } from "preact";
import { RoomData } from "../../lib/RoomData";
import { getViewAngleCenteredOn, clamp, locateClickInWorld } from "../../lib/util";
import { HotSpotZone } from "../../lib/Zone";
import { CellMatrix, generateCellMatrix, getWalkableCircles, getWalkablePolygons, getWalkableRectangle, isPointWalkable } from "../../lib/pathfinding/cells";
import { findPath } from "../../lib/pathfinding/pathfind";
import { Point } from "../../lib/pathfinding/geometry";
import { Room } from "../Room";
import MarkerShape from "../MarkerShape";


interface Props {
    rooms: RoomData[],
}

interface State {
    viewAngle: number
    markerX: number
    markerY: number
    timer?: number
    room: RoomData
    cellMatrix?: CellMatrix
    path?: Point[]
}

const speed = 1
const cellSize = 5

export default class Game extends Component<Props, State> {

    refs: {}

    constructor(props: Props) {
        super(props)
        const [firstRoom] = props.rooms
        this.state = {
            viewAngle: 0,
            markerX: firstRoom.width / 2,
            markerY: 50,
            room: firstRoom,
            path: [],
        }

        this.tick = this.tick.bind(this)
        this.handleRoomClick = this.handleRoomClick.bind(this)
        this.handleHotSpotClick = this.handleHotSpotClick.bind(this)
        this.moveAlongPath = this.moveAlongPath.bind(this)
        this.followMarker = this.followMarker.bind(this)
        this.updateCellMatrix = this.updateCellMatrix.bind(this)
    }

    componentWillMount(): void {
        const timer = window.setInterval(() => { this.tick() }, 10)
        this.setState({ timer })
        this.updateCellMatrix()
    }

    componentWillUnmount(): void {
        window.clearInterval(this.state.timer)
    }

    tick() {
        this.moveAlongPath(speed)
        this.followMarker()
    }

    moveAlongPath(speed: number) {
        const { path, markerX, markerY } = this.state
        const [nextStep] = path;
        if (!nextStep) { return }

        let newMarkerX = markerX
        let newMarkerY = markerY
        if (markerX !== nextStep.x) {
            const distance = Math.min(speed, Math.abs(markerX - nextStep.x))
            const direction = markerX < nextStep.x ? 1 : -1
            newMarkerX = markerX + (distance * direction)
        }
        if (markerY !== nextStep.y) {
            const distance = Math.min(speed, Math.abs(markerY - nextStep.y))
            const direction = markerY < nextStep.y ? 1 : -1
            newMarkerY = markerY + (distance * direction)
        }

        if (nextStep.x == newMarkerX && nextStep.y == newMarkerY) {
            path.shift()
            this.setState({ path })
        }

        this.setState({ markerX: newMarkerX, markerY: newMarkerY, path })
    }

    followMarker() {
        const { markerX, room } = this.state
        const viewAngle = clamp(getViewAngleCenteredOn(markerX, room), 1, -1)
        this.setState({ viewAngle })
    }

    handleHotSpotClick(zone: HotSpotZone) {
        console.log('hotspot click', zone.name)
    }

    handleRoomClick(x: number, y: number) {
        if (!this.state.cellMatrix) {
            console.warn('NO CELLMATRIX IN STATE')
            return
        }

        const { viewAngle, room, cellMatrix, markerX, markerY } = this.state
        const pointClicked = locateClickInWorld(x, y, viewAngle, room)
        const pointIsWalkable = isPointWalkable(pointClicked, getWalkablePolygons(room), getWalkableRectangle(room), getWalkableCircles(room))

        if (!pointIsWalkable) {
            return
        }

        const path = findPath({ x: markerX, y: markerY }, pointClicked, cellMatrix, cellSize)
        this.setState({
            path
        })
    }

    updateCellMatrix() {
        this.setState({
            cellMatrix: generateCellMatrix(this.state.room, cellSize)
        })
    }

    render() {
        const { viewAngle, markerX, markerY, room } = this.state

        return (
            <main>
                <Room
                    data={room} scale={2}
                    viewAngle={viewAngle}
                    handleRoomClick={this.handleRoomClick}
                    handleHotSpotClick={this.handleHotSpotClick}
                    // use for debugging - slows render!
                    // walkableCells={this.state.cellMatrix}
                    showWalkableAreas
                >
                    <MarkerShape
                        x={markerX} y={markerY}
                        roomData={room}
                        viewAngle={viewAngle}
                        color='red' />
                </Room>
            </main>
        )
    }
}
