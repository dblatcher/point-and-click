import { Component } from "preact";
import { RoomData } from "../../lib/RoomData";
import { getViewAngleCenteredOn, clamp, locateClickInWorld } from "../../lib/util";
import { HotSpotZone } from "../../lib/Zone";
import { CellMatrix, generateCellMatrix } from "../../lib/pathfinding/cells";
import { findPath } from "../../lib/pathfinding/pathfind";
import { Room } from "../Room";
import MarkerShape from "../MarkerShape";
import { MoveOrder, Order } from "../../lib/Order";
import { exectuteMove } from "../../lib/characters/executeMove";
import { exectuteTalk } from "../../lib/characters/executeTalk";
import SpriteShape from "../SpriteShape";


interface Props {
    rooms: RoomData[],
}

interface State {
    viewAngle: number
    room: RoomData
    cellMatrix?: CellMatrix
    timer?: number

    markerX: number
    markerY: number
    dialogue?: string
    orders: Order[]
}

const speed = 4
const cellSize = 10

export default class Game extends Component<Props, State> {

    refs: {}

    constructor(props: Props) {
        super(props)
        const [firstRoom] = props.rooms
        this.state = {
            viewAngle: 0,
            room: firstRoom,
            markerX: firstRoom.width / 2,
            markerY: 0,
            orders: []
        }

        this.tick = this.tick.bind(this)
        this.handleRoomClick = this.handleRoomClick.bind(this)
        this.handleHotSpotClick = this.handleHotSpotClick.bind(this)
        this.executeOrder = this.executeOrder.bind(this)
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
        this.executeOrder(speed)
        this.followMarker()
    }

    executeOrder(speed: number) {
        const { orders, markerX, markerY } = this.state
        const [nextOrder] = orders
        if (!nextOrder) { return }

        if (nextOrder.type === 'move') {
            const newPosition = exectuteMove(nextOrder, markerX, markerY, speed)
            if (nextOrder.steps.length === 0) {
                orders.shift()
            }
            this.setState({ markerX: newPosition.x, markerY: newPosition.y, orders, dialogue:undefined })
        }

        if (nextOrder.type === 'talk') {
            let dialogue = exectuteTalk(nextOrder)

            if (nextOrder.steps.length === 0) {
                orders.shift()
                dialogue = undefined
            }
            this.setState({ orders, dialogue })
        }
    }

    followMarker() {
        const { markerX, room } = this.state
        const viewAngle = clamp(getViewAngleCenteredOn(markerX, room), 1, -1)
        this.setState({ viewAngle })
    }

    handleHotSpotClick(zone: HotSpotZone) {
        console.log('hotspot click', zone.name)
        const { orders } = this.state

        orders.push({
            type: 'talk',
            steps: [
                { text: `You clicked on the ${zone.name}`, time: 50 },
                { text: `Yayy!`, time: 25 },
            ]
        })
    }

    handleRoomClick(x: number, y: number) {
        if (!this.state.cellMatrix) {
            console.warn('NO CELLMATRIX IN STATE')
            return
        }

        const { viewAngle, room, cellMatrix, markerX, markerY } = this.state
        const pointClicked = locateClickInWorld(x, y, viewAngle, room)

        const steps = findPath({ x: markerX, y: markerY }, pointClicked, cellMatrix, cellSize)
        const newOrder: MoveOrder = { type: 'move', steps }
        const orders = [newOrder] // clears any existing orders, even if the point was unreachable

        this.setState({
            orders
        })
    }

    updateCellMatrix() {
        this.setState({
            cellMatrix: generateCellMatrix(this.state.room, cellSize)
        })
    }

    render() {
        const { viewAngle, markerX, markerY, room, dialogue } = this.state

        return (
            <main>
                <Room
                    data={room} scale={2}
                    viewAngle={viewAngle}
                    handleRoomClick={this.handleRoomClick}
                    handleHotSpotClick={this.handleHotSpotClick}
                    // use for debugging - slows render!
                    obstacleCells={this.state.cellMatrix}
                    showObstacleAreas
                >
                    <MarkerShape
                        x={markerX} y={markerY}
                        text={dialogue}
                        roomData={room}
                        viewAngle={viewAngle}
                        color='red' />

                    <SpriteShape 
                        x={markerX} y={markerY}

                        roomData={room}
                        viewAngle={viewAngle}
                        width={50}
                        height={50}
                        sprite={'skinner'}
                        sequence={'walk'}
                        frameIndex={0}
                    />
                </Room>
            </main>
        )
    }
}
