import { Component } from "preact";
import { RoomData, Zone } from "../../lib/RoomData";
import { Room } from "../Room";
import { getViewAngleCenteredOn, clamp, locateClickInWorld } from "../../lib/util";


interface Props {
    data: RoomData,
}

interface State {
    viewAngle: number
    markerX: number
    markerY: number
    destinationX: number
    destinationY: number
    timer?: number
}

const speed = 2

export default class Game extends Component<Props, State> {

    refs: {}

    constructor(props: Props) {
        super(props)
        this.state = {
            viewAngle: 0,
            markerX: props.data.width / 2,
            markerY: 0,
            destinationX: props.data.width / 2,
            destinationY: 10,
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
        const { markerX } = this.state
        const { data } = this.props
        const viewAngle = clamp(getViewAngleCenteredOn(markerX, data), 1, -1)
        this.setState({ viewAngle })
    }

    handleHotSpotClick(zone: Zone) {
        console.log('hotspot click', zone.name)
    }

    handleRoomClick(x: number, y: number) {
        const { data } = this.props
        const { viewAngle } = this.state
        const vX = locateClickInWorld(x, viewAngle, data)

        this.setState({
            destinationX: vX,
            destinationY: data.height - y
        })
    }

    render() {
        const { data } = this.props
        const { viewAngle, markerX, markerY, } = this.state

        return (
            <main>
                <Room
                    data={data} scale={2} markerX={markerX} markerY={markerY}
                    viewAngle={viewAngle}
                    handleRoomClick={this.handleRoomClick}
                    handleHotSpotClick={this.handleHotSpotClick}
                />
            </main>
        )
    }
}
