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
import { initialCharacters } from "./characters";

interface Props {
    rooms: RoomData[],
}

interface State {
    viewAngle: number
    room: RoomData
    cellMatrix?: CellMatrix
    timer?: number
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

            characters: initialCharacters
        }

        this.tick = this.tick.bind(this)
        this.handleRoomClick = this.handleRoomClick.bind(this)
        this.handleHotSpotClick = this.handleHotSpotClick.bind(this)
        this.handleCharacterClick = this.handleCharacterClick.bind(this)
        this.makePlayerAct = this.makePlayerAct.bind(this)
        this.followMarker = this.followMarker.bind(this)
        this.updateCellMatrix = this.updateCellMatrix.bind(this)
    }

    get player(): (CharacterData | undefined) {
        return this.state.characters.find(character => character.isPlayer)
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

    handleHotSpotClick(zone: HotSpotZone) {
        console.log('hotspot click', zone.name)
        const { characters } = this.state
        const { player } = this
        if (!player) { return }

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

    updateCellMatrix() {
        this.setState({
            cellMatrix: generateCellMatrix(this.state.room, cellSize)
        })
    }

    render() {
        const { viewAngle, room, characters } = this.state
        const charactersInRenderOrder = characters.sort((a, b) => b.y - a.y)

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
                    {charactersInRenderOrder.map(characterData => <Character
                        clickHandler={characterData.isPlayer ? undefined : this.handleCharacterClick}
                        characterData={characterData}
                        roomData={room}
                        viewAngle={viewAngle} />
                    )}
                </Room>
            </main>
        )
    }
}
