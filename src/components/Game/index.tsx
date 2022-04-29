import { Component } from "preact";
import { RoomData } from "../../definitions/RoomData";
import { CharacterData } from "../../definitions/CharacterData"
import { ThingData } from "../../definitions/ThingData";
import { Verb } from "../../definitions/Verb";
import { CommandTarget } from "../../definitions/Command";
import { Interaction } from "../../definitions/Interaction";
import { getViewAngleCenteredOn, clamp, locateClickInWorld } from "../../lib/util";
import { CellMatrix, generateCellMatrix } from "../../lib/pathfinding/cells";
import followOrder from "./orders/followOrder";
import { issueMoveOrder } from "./issueMoveOrder";
import { handleCommand } from "./handleCommand";
import { Room } from "../Room";
import Character from "../Character";
import Thing from "../Thing";
import { VerbMenu } from "../VerbMenu";
import { ItemData } from "../../definitions/ItemData";
import { ItemMenu } from "../ItemMenu";


interface Props {
    initialRooms: RoomData[],
    initialThings: ThingData[],
    initialCharacters: CharacterData[],
    verbs: Verb[],
    interactions: Interaction[],
    items: ItemData[],
}

interface GameState {
    viewAngle: number
    cellMatrix?: CellMatrix
    timer?: number
    currentRoomName: string
    characters: CharacterData[]
    things: ThingData[]
    rooms: RoomData[]
    currentVerbId: string,
    currentItemId?: string,
    interactions: Interaction[],
    items: ItemData[],
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
        const items = props.items.map(data => JSON.parse(JSON.stringify(data))) as ItemData[];

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
            interactions: [...props.interactions],
            items,
        }

        this.tick = this.tick.bind(this)
        this.handleRoomClick = this.handleRoomClick.bind(this)
        this.handleTargetClick = this.handleTargetClick.bind(this)
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

    handleTargetClick(target: CommandTarget) {
        this.setState(handleCommand({
            verb: this.props.verbs.find(_ => _.id == this.state.currentVerbId),
            target
        }))
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
        const { viewAngle, characters, things, currentVerbId, currentItemId, items } = this.state
        const { currentRoom, player } = this

        const charactersAndThings = [...characters, ...things]
            .filter(_ => _.room === currentRoom.name)
            .sort((a, b) => b.y - a.y)

        return (
            <main>
                <Room
                    data={currentRoom} scale={2}
                    viewAngle={viewAngle}
                    handleRoomClick={this.handleRoomClick}
                    handleHotSpotClick={this.handleTargetClick}
                    // use for debugging - slows render!
                    // obstacleCells={this.state.cellMatrix}
                    showObstacleAreas
                >
                    {charactersAndThings.map(data =>
                        data.type === 'thing'
                            ? <Thing key={data.id}
                                clickHandler={this.handleTargetClick}
                                thingData={data}
                                roomData={currentRoom}
                                viewAngle={viewAngle}
                            />
                            : <Character key={data.id}
                                clickHandler={data.isPlayer ? undefined : this.handleTargetClick}
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

                <ItemMenu
                    items={items.filter(_ => _.characterId === player.id)}
                    currentItemId={currentItemId}
                    select={(item: ItemData) => {this.handleTargetClick(item)}}
                />
            </main>
        )
    }
}
