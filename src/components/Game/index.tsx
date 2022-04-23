import { Component } from "preact";
import { RoomData } from "../../lib/RoomData";
import { getViewAngleCenteredOn, clamp, locateClickInWorld } from "../../lib/util";
import { HotSpotZone } from "../../lib/Zone";
import { CellMatrix, generateCellMatrix } from "../../lib/pathfinding/cells";
import { findPath } from "../../lib/pathfinding/pathfind";
import { MoveOrder } from "../../lib/Order";
import { CharacterData } from "../../lib/CharacterData"
import followOrder from "../../lib/characters/followOrder";
import { initialCharacters } from "../../../data/characters";
import { initialThings } from "../../../data/things";
import { Room } from "../Room";
import Character from "../Character";
import { ThingData } from "../../lib/ThingData";
import Thing from "../Thing";

interface Props {
    rooms: RoomData[],
}

interface State {
    viewAngle: number
    room: RoomData
    cellMatrix?: CellMatrix
    timer?: number
    characters: CharacterData[]
    things: ThingData[]
}

const cellSize = 10

export default class Game extends Component<Props, State> {

    refs: {}

    constructor(props: Props) {
        super(props)
        const player = initialCharacters.find(character => character.isPlayer)
        const startingRoom = props.rooms.find(room => room.name === player?.room)
        const [firstRoom] = props.rooms

        this.state = {
            viewAngle: 0,
            room: startingRoom || firstRoom,
            characters: initialCharacters,
            things: initialThings,
        }

        this.tick = this.tick.bind(this)
        this.handleRoomClick = this.handleRoomClick.bind(this)
        this.handleHotSpotClick = this.handleHotSpotClick.bind(this)
        this.handleCharacterClick = this.handleCharacterClick.bind(this)
        this.handleThingClick = this.handleThingClick.bind(this)
        this.makePlayerAct = this.makePlayerAct.bind(this)
        this.followMarker = this.followMarker.bind(this)
    }

    get player(): (CharacterData | undefined) {
        return this.state.characters.find(character => character.isPlayer)
    }

    componentWillMount(): void {
        const timer = window.setInterval(() => { this.tick() }, 10)
        const cellMatrix = generateCellMatrix(this.state.room, cellSize)
        this.setState({ timer, cellMatrix })
    }

    componentWillUnmount(): void {
        window.clearInterval(this.state.timer)
    }

    tick() {
        this.makePlayerAct()
        this.followMarker()
    }

    makePlayerAct() {
        const { characters } = this.state
        characters.forEach(followOrder)
        this.setState({ characters })
    }

    followMarker() {
        const { room } = this.state
        const { player } = this
        if (!player) { return }
        const viewAngle = clamp(getViewAngleCenteredOn(player.x, room), 1, -1)
        this.setState({ viewAngle })
    }

    changeRoom(roomName: string, takePlayer?: boolean) {
        const { rooms } = this.props
        const { characters } = this.state
        const newRoom = rooms.find(room => room.name === roomName)
        if (!newRoom) { return }

        if (takePlayer) {
            this.player.room = newRoom.name
        }

        const cellMatrix = generateCellMatrix(newRoom, cellSize)
        this.setState({
            room: newRoom, cellMatrix, characters
        })
    }

    handleHotSpotClick(zone: HotSpotZone) {
        console.log('hotspot click', zone.name)
        const { characters } = this.state
        const { player } = this
        if (!player) { return }

        if (zone.name === 'bush') {
            return this.changeRoom('test-room-2', true)
        }
        if (zone.name === 'window') {
            return this.changeRoom('OUTSIDE', true)
        }

        player.orders.push({
            type: 'talk',
            steps: [
                { text: `You clicked on the ${zone.name}`, time: 150 },
                { text: `Yayy!`, time: 125 },
            ]
        })

        this.setState({ characters })
    }

    handleCharacterClick(characterData: CharacterData) {
        console.log('character click', characterData.id)
    }

    handleThingClick(thingData: ThingData) {
        console.log('thing click', thingData.id)
    }

    handleRoomClick(x: number, y: number) {
        if (!this.state.cellMatrix) {
            console.warn('NO CELLMATRIX IN STATE')
            return
        }

        const { viewAngle, room, cellMatrix, characters } = this.state
        const { player } = this
        if (!player) { return }
        const pointClicked = locateClickInWorld(x, y, viewAngle, room)

        const steps = findPath({ x: player.x, y: player.y }, pointClicked, cellMatrix, cellSize)
        const newOrder: MoveOrder = { type: 'move', steps }
        player.orders = [newOrder] // clears any existing orders, even if the point was unreachable

        this.setState({ characters })
    }

    render() {
        const { viewAngle, room, characters, things } = this.state

        const charactersAndThings = [...characters, ...things]
            .filter(_ => _.room === room.name)
            .sort((a, b) => b.y - a.y)

        return (
            <main>
                <Room
                    data={room} scale={2}
                    viewAngle={viewAngle}
                    handleRoomClick={this.handleRoomClick}
                    handleHotSpotClick={this.handleHotSpotClick}
                // use for debugging - slows render!
                obstacleCells={this.state.cellMatrix}
                // showObstacleAreas
                >
                    {charactersAndThings.map(data =>
                        data.type === 'thing' ?
                            <Thing
                                clickHandler={this.handleThingClick}
                                thingData={data}
                                roomData={room}
                                viewAngle={viewAngle}
                            />
                            : <Character
                                clickHandler={data.isPlayer ? undefined : this.handleCharacterClick}
                                characterData={data}
                                roomData={room}
                                viewAngle={viewAngle} />
                    )}
                </Room>
            </main>
        )
    }
}
