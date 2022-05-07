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
import { CommandLine } from "../CommandLine";
import { Order } from "../../definitions/Order";
import { Sequence } from "../../definitions/Sequence"


const TIMER_SPEED = 10

interface GameProps {
    readonly initialRooms: RoomData[],
    readonly initialThings: ThingData[],
    readonly initialCharacters: CharacterData[],
    readonly verbs: Verb[],
    readonly interactions: Interaction[],
    readonly items: ItemData[],
    readonly sequences: { [index: string]: Sequence }
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
    characterOrders: { [index: string]: Order[] }
    sequenceRunning?: Sequence;
}

export type { GameState, GameProps }

export const cellSize = 10

export default class Game extends Component<GameProps, GameState> {

    refs: {}

    constructor(props: GameProps) {
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
            isPaused: false,
            currentRoomName: startingRoom.name || firstRoom.name,
            characters,
            things,
            rooms,

            currentVerbId: props.verbs[0].id,
            interactions: [...props.interactions],
            items,
            characterOrders: {},
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
        const { characters, characterOrders, sequenceRunning: sequence } = this.state

        let sequenceIsFinished: boolean

        if (sequence) {
            const orderSource = sequence[0].characterOrders;

            const validCharacterIds = characters.map(_ => _.id)
            const invalidIds = Object.keys(orderSource).filter(_ => !validCharacterIds.includes(_))

            invalidIds.forEach(_ => {
                console.warn(`invalid character id in stage: ${_}`)
                delete orderSource[_]
            })

            const emptyOrderLists = Object.keys(orderSource).filter(_ => orderSource[_].length === 0)

            emptyOrderLists.forEach(_ => {
                console.log(`character finished orders in stage: ${_}`)
                delete orderSource[_]
            })

            characters.forEach(character => followOrder(character, orderSource[character.id]))

            const stageIsFinished = Object.keys(orderSource).length === 0
            if (stageIsFinished) {
                sequence.shift()
                console.log(`stage finished, ${sequence.length} left.`)
                sequenceIsFinished = sequence.length === 0;
            }

        } else {
            characters.forEach(character => followOrder(character, characterOrders[character.id]))
        }

        const newSequenceValue = sequenceIsFinished ? undefined : sequence;

        this.setState({ characters, sequenceRunning: newSequenceValue, characterOrders })
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
        this.setState(issueMoveOrder(pointClicked, player.id))
    }

    render() {
        const { verbs = [] } = this.props
        const { viewAngle, isPaused,
            characters, things, currentVerbId, currentItemId, items,
            characterOrders, sequenceRunning } = this.state
        const { currentRoom, player } = this

        const orderSource = sequenceRunning ? sequenceRunning[0].characterOrders : characterOrders;

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
                        data.type === 'thing'
                            ? <Thing key={data.id}
                                isPaused={isPaused}
                                clickHandler={this.handleTargetClick}
                                thingData={data}
                                roomData={currentRoom}
                                viewAngle={viewAngle}
                            />
                            : <Character key={data.id}
                                isPaused={isPaused}
                                clickHandler={data.isPlayer ? undefined : this.handleTargetClick}
                                characterData={data}
                                orders={orderSource[data.id]}
                                roomData={currentRoom}
                                viewAngle={viewAngle} />
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
