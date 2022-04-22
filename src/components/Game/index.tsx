import { Component } from "preact";
import { RoomData } from "../../lib/RoomData";
import { getViewAngleCenteredOn, clamp, locateClickInWorld } from "../../lib/util";
import { HotSpotZone } from "../../lib/Zone";
import { CellMatrix, generateCellMatrix } from "../../lib/pathfinding/cells";
import { findPath } from "../../lib/pathfinding/pathfind";
import { Room } from "../Room";
import { MoveOrder } from "../../lib/Order";
import Character from "../Character";
import { CharacterData } from "../../lib/CharacterData"
import followOrder from "../../lib/characters/followOrder";

interface Props {
    rooms: RoomData[],
}

interface State {
    viewAngle: number
    room: RoomData
    cellMatrix?: CellMatrix
    timer?: number

    player: CharacterData
    characters: CharacterData[]
}

const cellSize = 10

export default class Game extends Component<Props, State> {

    refs: {}

    constructor(props: Props) {
        super(props)
        const [firstRoom] = props.rooms
        this.state = {
            viewAngle: 0,
            room: firstRoom,
            player: {
                isPlayer: true,
                x: (firstRoom.width / 2),
                y: 10,
                width: 40,
                height: 80,
                orders: [],
                sprite: 'skinner',
                direction: 'left',
            },
            characters: [
                {
                    x: (firstRoom.width*  2/ 5),
                    y: 10,
                    width: 40,
                    height: 80,
                    orders: [
                        {type:'talk', steps:[{text:'I am evil skinner...', time:100}]},
                        {type:'talk', steps:[{text:'...I AM evil skinner', time:100}]},
                        {type:'move', steps:[{x:200, y:30}]},
                    ],
                    sprite: 'skinner',
                    direction: 'right',
                    filter: 'hue-rotate(45deg)',
                },
                {
                    x: (firstRoom.width*  3/ 5),
                    y: 10,
                    width: 40,
                    height: 80,
                    orders: [],
                    sprite: 'skinner',
                    direction: 'right',
                    filter: 'invert(1)',
                },
            ]
        }

        this.tick = this.tick.bind(this)
        this.handleRoomClick = this.handleRoomClick.bind(this)
        this.handleHotSpotClick = this.handleHotSpotClick.bind(this)
        this.makePlayerAct = this.makePlayerAct.bind(this)
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
        this.makePlayerAct()
        this.followMarker()
    }

    makePlayerAct() {
        const { player, characters } = this.state
        followOrder(player)

        characters.forEach(followOrder)

        this.setState({ player, characters })
    }

    followMarker() {
        const { player, room } = this.state
        const viewAngle = clamp(getViewAngleCenteredOn(player.x, room), 1, -1)
        this.setState({ viewAngle })
    }

    handleHotSpotClick(zone: HotSpotZone) {
        console.log('hotspot click', zone.name)
        const { player } = this.state

        player.orders.push({
            type: 'talk',
            steps: [
                { text: `You clicked on the ${zone.name}`, time: 150 },
                { text: `Yayy!`, time: 125 },
            ]
        })

        this.setState({ player })
    }

    handleRoomClick(x: number, y: number) {
        if (!this.state.cellMatrix) {
            console.warn('NO CELLMATRIX IN STATE')
            return
        }

        const { viewAngle, room, cellMatrix, player } = this.state
        const pointClicked = locateClickInWorld(x, y, viewAngle, room)

        const steps = findPath({ x: player.x, y: player.y }, pointClicked, cellMatrix, cellSize)
        const newOrder: MoveOrder = { type: 'move', steps }
        player.orders = [newOrder] // clears any existing orders, even if the point was unreachable

        this.setState({ player })
    }

    updateCellMatrix() {
        this.setState({
            cellMatrix: generateCellMatrix(this.state.room, cellSize)
        })
    }

    render() {
        const { viewAngle, room, player, characters } = this.state

        return (
            <main>
                <Room
                    data={room} scale={2}
                    viewAngle={viewAngle}
                    handleRoomClick={this.handleRoomClick}
                    handleHotSpotClick={this.handleHotSpotClick}
                    // use for debugging - slows render!
                    // obstacleCells={this.state.cellMatrix}
                    showObstacleAreas
                >
                    <Character
                        characterData={player}
                        roomData={room}
                        viewAngle={viewAngle} />

                    {characters.map(characterData => <Character
                        characterData={characterData}
                        roomData={room}
                        viewAngle={viewAngle} />
                    )}
                </Room>
            </main>
        )
    }
}
