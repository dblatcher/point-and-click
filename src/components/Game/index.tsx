import { Component } from "preact";
import { RoomData } from "../../lib/RoomData";
import { getViewAngleCenteredOn, clamp, locateClickInWorld } from "../../lib/util";
import { HotSpotZone } from "../../lib/Zone";
import { CellMatrix, generateCellMatrix } from "../../lib/pathfinding/cells";
import { CharacterData } from "../../lib/CharacterData"
import followOrder from "./orders/followOrder";
import { Room } from "../Room";
import Character from "../Character";
import { ThingData } from "../../lib/ThingData";
import Thing from "../Thing";
import { Point } from "../../lib/pathfinding/geometry";
import { changeRoom } from "./changeRoom";
import { issueMoveOrder } from "./issueMoveOrder";
import { Verb } from "../../lib/Verb";
import { VerbMenu } from "../VerbMenu";

interface Props {
    initialRooms: RoomData[],
    initialThings: ThingData[],
    initialCharacters: CharacterData[],
    verbs: Verb[]
}

interface GameState {
    viewAngle: number
    cellMatrix?: CellMatrix
    timer?: number
    currentRoomName: string
    characters: CharacterData[]
    things: ThingData[]
    rooms: RoomData[]
    currentVerbId: string
}

export type { GameState }

export const cellSize = 10

export default class Game extends Component<Props, GameState> {

    refs: {}

    constructor(props: Props) {
        super(props)
        const rooms = props.initialRooms.map(data => JSON.parse(JSON.stringify(data))) as RoomData[];
        const characters = props.initialCharacters.map(data => JSON.parse(JSON.stringify(data))) as CharacterData[];
        const things = props.initialThings.map(data => JSON.parse(JSON.stringify(data))) as ThingData[];

        const player = characters.find(character => character.isPlayer)
        const startingRoom = props.initialRooms.find(room => room.name === player?.room)
        const [firstRoom] = props.initialRooms

        this.state = {
            viewAngle: 0,
            currentRoomName: startingRoom.name || firstRoom.name,
            characters,
            things,
            rooms,
            currentVerbId: props.verbs[0].id,
        }

        this.tick = this.tick.bind(this)
        this.handleRoomClick = this.handleRoomClick.bind(this)
        this.handleHotSpotClick = this.handleHotSpotClick.bind(this)
        this.handleCharacterClick = this.handleCharacterClick.bind(this)
        this.handleThingClick = this.handleThingClick.bind(this)
        this.makeCharactersAct = this.makeCharactersAct.bind(this)
        this.followMarker = this.followMarker.bind(this)
    }

    get player(): (CharacterData | undefined) {
        return this.state.characters.find(character => character.isPlayer)
    }

    get currentRoom(): (RoomData | undefined) {

        const { currentRoomName, rooms } = this.state
        return rooms.find(_ => _.name === currentRoomName)
    }

    componentWillMount(): void {
        const timer = window.setInterval(() => { this.tick() }, 10)
        const cellMatrix = generateCellMatrix(this.currentRoom, cellSize)
        this.setState({ timer, cellMatrix })
    }

    componentWillUnmount(): void {
        window.clearInterval(this.state.timer)
    }

    tick() {
        this.makeCharactersAct()
        this.followMarker()
    }

    makeCharactersAct() {
        const { characters } = this.state
        characters.forEach(followOrder)
        this.setState({ characters })
    }

    followMarker() {
        const { currentRoom } = this
        const { player } = this
        if (!player || !currentRoom) { return }
        const viewAngle = clamp(getViewAngleCenteredOn(player.x, currentRoom), 1, -1)
        this.setState({ viewAngle })
    }

    changeCurrentRoom(roomName: string, takePlayer?: boolean, newPosition?: Point) {
        const { rooms } = this.state
        const newRoom = rooms.find(room => room.name === roomName)
        if (!newRoom) { return }

        this.setState(changeRoom(
            newRoom, cellSize, takePlayer, newPosition
        ))
    }

    handleHotSpotClick(zone: HotSpotZone) {
        console.log('hotspot click', zone.name)
        const { characters } = this.state
        const { player } = this
        if (!player) { return }

        if (zone.name === 'bush') {
            return this.changeCurrentRoom('test-room-2', true, { y: 5, x: 100 })
        }
        if (zone.name === 'window') {
            return this.changeCurrentRoom('OUTSIDE', true, { y: 12, x: 200 })
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
        console.log('room click', x, y)
        const { player, currentRoom } = this
        if (!player || !currentRoom) { return }
        const pointClicked = locateClickInWorld(x, y, this.state.viewAngle, currentRoom)
        this.setState(issueMoveOrder(pointClicked, player.id))
    }

    render() {
        const { verbs = [] } = this.props
        const { viewAngle, characters, things, currentVerbId } = this.state
        const { currentRoom } = this

        const charactersAndThings = [...characters, ...things]
            .filter(_ => _.room === currentRoom.name)
            .sort((a, b) => b.y - a.y)

        return (
            <main>
                <Room
                    data={currentRoom} scale={2}
                    viewAngle={viewAngle}
                    handleRoomClick={this.handleRoomClick}
                    handleHotSpotClick={this.handleHotSpotClick}
                    // use for debugging - slows render!
                    obstacleCells={this.state.cellMatrix}
                // showObstacleAreas
                >
                    {charactersAndThings.map(data =>
                        data.type === 'thing'
                            ? <Thing key={data.id}
                                clickHandler={this.handleThingClick}
                                thingData={data}
                                roomData={currentRoom}
                                viewAngle={viewAngle}
                            />
                            : <Character key={data.id}
                                clickHandler={data.isPlayer ? undefined : this.handleCharacterClick}
                                characterData={data}
                                roomData={currentRoom}
                                viewAngle={viewAngle} />
                    )}
                </Room>

                <VerbMenu 
                    verbs={verbs} 
                    currentVerbId={currentVerbId} 
                    select={(verb: Verb) => { this.setState({ currentVerbId: verb.id }) }} 
                />
            </main>
        )
    }
}
