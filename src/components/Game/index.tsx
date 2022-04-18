import { Component } from "preact";
import { RoomData } from "../../lib/RoomData";
import { Room } from "../Room";
import { getViewAngleCenteredOn, clamp, locateClickInWorld } from "../../lib/util";
import MarkerShape from "../MarkerShape";
import { HotSpotZone } from "../../lib/Zone";
import { CellMatrix, generateCellMatrix, getWalkablePolygons, isPointWalkable } from "../../lib/pathfinding/cells";


interface Props {
    rooms: RoomData[],
}

interface State {
    viewAngle: number
    markerX: number
    markerY: number
    destinationX: number
    destinationY: number
    timer?: number
    room: RoomData
    cellMatrix?: CellMatrix
}

const speed = 1

export default class Game extends Component<Props, State> {

    refs: {}

    constructor(props: Props) {
        super(props)
        const [firstRoom] = props.rooms
        this.state = {
            viewAngle: 0,
            markerX: firstRoom.width / 2,
            markerY: 0,
            destinationX: firstRoom.width / 2,
            destinationY: 10,
            room: firstRoom,
        }

        this.tick = this.tick.bind(this)
        this.handleRoomClick = this.handleRoomClick.bind(this)
        this.handleHotSpotClick = this.handleHotSpotClick.bind(this)
        this.moveHorizontalStep = this.moveHorizontalStep.bind(this)
        this.moveVerticalStep = this.moveVerticalStep.bind(this)
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
        this.moveHorizontalStep(speed)
        this.moveVerticalStep(speed)
        this.followMarker()
    }

    moveHorizontalStep(speed: number) {
        const { markerX, destinationX } = this.state
        if (markerX !== destinationX) {
            const distance = Math.min(speed, Math.abs(markerX - destinationX))
            const direction = markerX < destinationX ? 1 : -1
            this.setState({ markerX: markerX + (distance * direction) })
        }
    }

    moveVerticalStep(speed: number) {
        const { markerY, destinationY } = this.state
        if (markerY !== destinationY) {
            const distance = Math.min(speed, Math.abs(markerY - destinationY))
            const direction = markerY < destinationY ? 1 : -1
            this.setState({ markerY: markerY + (distance * direction) })
        }
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
        const { viewAngle, room } = this.state
        const pointClicked = locateClickInWorld(x, y, viewAngle, room)
        const pointIsWalkable = isPointWalkable(pointClicked, getWalkablePolygons(room))

        console.log(pointIsWalkable, pointClicked)

        if (!pointIsWalkable) {
            // return
        }

        this.setState({
            destinationX: pointClicked.x,
            destinationY: pointClicked.y,
        })
    }

    updateCellMatrix() {
        this.setState({
            cellMatrix: generateCellMatrix(this.state.room, 10)
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
                    walkableCells={this.state.cellMatrix}
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
