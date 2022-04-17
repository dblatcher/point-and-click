import { Component } from "preact";
import { RoomData, Zone } from "../../lib/RoomData";
import { Room } from "../Room";
import { getViewAngleCenteredOn, clamp, locateClickInWorld } from "../../lib/util";
import MarkerShape from "../MarkerShape";


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
    }

    componentWillMount(): void {
        const timer = window.setInterval(() => { this.tick() }, 10)
        this.setState({ timer })
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

    handleHotSpotClick(zone: Zone) {
        console.log('hotspot click', zone.name)
    }

    handleRoomClick(x: number, y: number) {
        const { viewAngle, room } = this.state

        this.setState({
            destinationX: locateClickInWorld(x, viewAngle, room),
            destinationY: room.height - y
        })
    }

    render() {
        const { viewAngle, markerX, markerY, room } = this.state

        return (
            <main>
                <Room
                    data={room} scale={2} markerX={markerX} markerY={markerY}
                    viewAngle={viewAngle}
                    handleRoomClick={this.handleRoomClick}
                    handleHotSpotClick={this.handleHotSpotClick}
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
