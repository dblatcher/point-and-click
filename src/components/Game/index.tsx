import { Component } from "preact";
import { RoomData } from "../../definitions/RoomData";
import { CharacterData } from "../../definitions/CharacterData"
import { ThingData } from "../../definitions/ThingData";
import { Verb } from "../../definitions/Verb";
import { CommandTarget } from "../../definitions/Command";
import { Interaction } from "../../definitions/Interaction";
import { getViewAngleCenteredOn, clamp, locateClickInWorld } from "../../lib/util";
import { CellMatrix, generateCellMatrix } from "../../lib/pathfinding/cells";
import { followOrder } from "./orders/followOrder";
import { issueMoveOrder } from "./issueMoveOrder";
import { handleCommand } from "./handleCommand";
import { Room } from "../Room";
import CharacterOrThing from "../CharacterOrThing";
import { VerbMenu } from "../VerbMenu";
import { ItemData } from "../../definitions/ItemData";
import { ItemMenu } from "../ItemMenu";
import { CommandLine } from "../CommandLine";
import { Order, ThingOrder } from "../../definitions/Order";
import { Sequence } from "../../definitions/Sequence"
import { cloneData } from "../../lib/clone";
import { continueSequence } from "./continueSequence";


const TIMER_SPEED = 10

interface GameProps {
    readonly initialRooms: RoomData[],
    readonly initialThings: ThingData[],
    readonly initialCharacters: CharacterData[],
    readonly verbs: Verb[],
    readonly interactions: Interaction[],
    readonly items: ItemData[],
    readonly sequences: Record<string, Sequence>
}

interface GameState {
    viewAngle: number
    isPaused: boolean
    timer?: number
    cellMatrix?: CellMatrix
    currentRoomName: string
    characters: CharacterData[]
    things: ThingData[]
    rooms: RoomData[]
    currentVerbId: string,
    currentItemId?: string,
    interactions: Interaction[],
    items: ItemData[],
    characterOrders: Record<string, Order[]>
    thingOrders: Record<string, ThingOrder[]>
    sequenceRunning?: Sequence;
}

export type { GameState, GameProps }

export const cellSize = 10

export default class Game extends Component<GameProps, GameState> {

    refs: {}

    constructor(props: GameProps) {
        super(props)
        //TO DO - integrity check - no duplicate ids
        const rooms = props.initialRooms.map(cloneData);
        const characters = props.initialCharacters.map(cloneData);
        const things = props.initialThings.map(cloneData);
        const items = props.items.map(cloneData);

        const player = characters.find(character => character.isPlayer)
        const startingRoom = rooms.find(room => room.name === player?.room)
        const [firstRoom] = rooms

        this.state = {
            viewAngle: 0,
            isPaused: false,
            currentRoomName: startingRoom.name || firstRoom.name,
            characters,
            things,
            rooms,

            currentVerbId: props.verbs[0].id,
            interactions: [...props.interactions],
            items,
            characterOrders: {},
            thingOrders: {},
        }

        this.tick = this.tick.bind(this)
        this.handleRoomClick = this.handleRoomClick.bind(this)
        this.handleTargetClick = this.handleTargetClick.bind(this)
        this.makeCharactersAct = this.makeCharactersAct.bind(this)
        this.centerViewOnPLayer = this.centerViewOnPLayer.bind(this)
    }

    get player(): (CharacterData | undefined) {
        return this.state.characters.find(character => character.isPlayer)
    }

    get currentRoom(): (RoomData | undefined) {
        const { currentRoomName, rooms } = this.state
        return rooms.find(_ => _.name === currentRoomName)
    }

    get currentVerb(): Verb {
        return this.props.verbs.find(_ => _.id == this.state.currentVerbId)
    }

    get currentItem(): ItemData {
        return this.state.items.find(_ => _.id == this.state.currentItemId)
    }

    componentWillMount(): void {
        const timer = window.setInterval(() => { this.tick() }, TIMER_SPEED)
        const cellMatrix = generateCellMatrix(this.currentRoom, cellSize)
        this.setState({ timer, cellMatrix })
    }

    componentWillUnmount(): void {
        window.clearInterval(this.state.timer)
    }

    tick() {
        const { isPaused } = this.state
        if (isPaused) { return }
        this.makeCharactersAct()
        this.centerViewOnPLayer()
    }

    makeCharactersAct() {
        const { characters, characterOrders, thingOrders, sequenceRunning, things, cellMatrix } = this.state
        if (sequenceRunning) {
            return this.setState(continueSequence(this.state, this.props))
        } else {
            characters.forEach(character => followOrder(character, cellMatrix, characterOrders[character.id]))
            things.forEach(thing => followOrder(thing, cellMatrix, thingOrders[thing.id]))
            return this.setState({ characters, characterOrders })
        }
    }

    centerViewOnPLayer() {
        const { currentRoom } = this
        const { player } = this
        if (!player || !currentRoom) { return }
        const viewAngle = clamp(getViewAngleCenteredOn(player.x, currentRoom), 1, -1)
        this.setState({ viewAngle })
    }

    handleTargetClick(target: CommandTarget) {
        const { currentVerbId, currentItemId, items, sequenceRunning } = this.state
        if (sequenceRunning) { return }
        const { verbs } = this.props
        const verb = verbs.find(_ => _.id == currentVerbId);
        const item = items.find(_ => _.id == currentItemId);

        if (target.type === 'item' && target.id === currentItemId) {
            this.setState({ currentItemId: undefined })
            return
        }

        // TO DO - handle 'USE $ITEM' as target with no other $ITEM
        // could check interactions
        if (target.type === 'item' && !currentItemId && verb.preposition) {
            this.setState({ currentItemId: target.id })
            return
        }

        this.setState(
            handleCommand({ verb, target, item }, this.props)
        )
    }

    handleRoomClick(x: number, y: number) {
        const { sequenceRunning } = this.state
        if (sequenceRunning) { return }
        const { player, currentRoom } = this
        if (!player || !currentRoom) { return }
        const pointClicked = locateClickInWorld(x, y, this.state.viewAngle, currentRoom)
        this.setState(issueMoveOrder(pointClicked, player.id, false, false))
    }

    render() {
        const { verbs = [] } = this.props
        const { viewAngle, isPaused,
            characters, things, currentVerbId, currentItemId, items,
            characterOrders, sequenceRunning, thingOrders } = this.state
        const { currentRoom, player } = this

        const characterOrderMap = sequenceRunning ? sequenceRunning[0].characterOrders || {} : characterOrders;
        const thingOrderMap = sequenceRunning ? sequenceRunning[0].thingOrders || {} : thingOrders;

        const charactersAndThings = [...characters, ...things]
            .filter(_ => _.room === currentRoom.name)
            .sort((a, b) => b.y - a.y)

        return (
            <main>
                <button onClick={() => { this.setState({ isPaused: !isPaused }) }}>{isPaused ? 'resume' : 'pause'}</button>
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
                        <CharacterOrThing key={data.id}
                            isPaused={isPaused}
                            clickHandler={data.type == 'character' && data.isPlayer ? undefined : this.handleTargetClick}
                            data={data}
                            orders={data.type == 'character' ? characterOrderMap[data.id] : thingOrderMap[data.id]}
                            roomData={currentRoom}
                            viewAngle={viewAngle}
                        />
                    )}
                </Room>

                {!sequenceRunning && <>
                    <CommandLine verb={this.currentVerb} item={this.currentItem} />

                    <VerbMenu
                        verbs={verbs}
                        currentVerbId={currentVerbId}
                        select={(verb: Verb) => { this.setState({ currentVerbId: verb.id, currentItemId: undefined }) }}
                    />

                    <ItemMenu
                        items={items.filter(_ => _.characterId === player.id)}
                        currentItemId={currentItemId}
                        select={(item: ItemData) => { this.handleTargetClick(item) }}
                    />
                </>}
            </main>
        )
    }
}
