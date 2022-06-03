/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h, Fragment } from "preact";
import { RoomData } from "../../definitions/RoomData";
import { CharacterData } from "../../definitions/CharacterData"
import { Verb } from "../../definitions/Verb";
import { CommandTarget } from "../../definitions/Command";
import { getViewAngleCenteredOn, clamp, locateClickInWorld } from "../../lib/util";
import { CellMatrix, generateCellMatrix } from "../../lib/pathfinding/cells";
import { followOrder } from "./orders/followOrder";
import { issueMoveOrder } from "./issueMoveOrder";
import { handleCommand } from "./handleCommand";
import { Room } from "../Room";
import { CharacterOrThing } from "../CharacterOrThing";
import { VerbMenu } from "../VerbMenu";
import { ItemData } from "../../definitions/ItemData";
import { ItemMenu } from "../ItemMenu";
import { CommandLine } from "../CommandLine";
import { cloneData } from "../../lib/clone";
import { continueSequence } from "./continueSequence";
import { GameData, GameCondition } from "../../definitions/Game";


export type GameProps = Readonly<{
    save?: { (saveDate: GameData): void };
    reset?: { (): void };
    load?: { (): void };
} & GameCondition>

export type GameState = GameData & {
    viewAngle: number;
    isPaused: boolean;
    timer?: number;
    cellMatrix?: CellMatrix;
    currentVerbId: string;
    currentItemId?: string;
}

export const cellSize = 10
const TIMER_SPEED = 10

export default class Game extends Component<GameProps, GameState> {

    refs!: {}

    constructor(props: GameProps) {
        super(props)
        //TO DO - integrity check - no duplicate ids

        this.state = this.getInitialGameState(props)

        this.tick = this.tick.bind(this)
        this.handleRoomClick = this.handleRoomClick.bind(this)
        this.handleTargetClick = this.handleTargetClick.bind(this)
        this.makeCharactersAct = this.makeCharactersAct.bind(this)
        this.centerViewOnPLayer = this.centerViewOnPLayer.bind(this)
    }

    getInitialGameState(props: GameProps): GameState {
        const rooms = props.rooms.map(cloneData);
        const characters = props.characters.map(cloneData);
        const things = props.things.map(cloneData);
        const items = props.items.map(cloneData);

        return {
            viewAngle: 0,
            isPaused: false,
            currentRoomName: props.currentRoomName,
            characters,
            things,
            rooms,

            currentVerbId: props.verbs[0].id,
            interactions: [...props.interactions],
            items,
            sequenceRunning: props.sequenceRunning || undefined,
            characterOrders: props.characterOrders || {},
            thingOrders: props.thingOrders || {},
        }
    }

    get saveData(): GameData {
        const {
            rooms, things, characters, interactions, items, currentRoomName, characterOrders, thingOrders, sequenceRunning
        } = this.state

        return {
            rooms, things, characters, interactions, items, currentRoomName, characterOrders, thingOrders, sequenceRunning
        }
    }

    get player(): (CharacterData | undefined) {
        return this.state.characters.find(character => character.isPlayer)
    }

    get currentRoom(): (RoomData | undefined) {
        const { currentRoomName, rooms } = this.state
        return rooms.find(_ => _.name === currentRoomName)
    }

    get currentVerb(): Verb | undefined {
        if (!this.state.currentVerbId) { return undefined }
        return this.props.verbs.find(_ => _.id == this.state.currentVerbId)
    }

    get currentItem(): ItemData | undefined {
        if (!this.state.currentItemId) { return undefined }
        return this.state.items.find(_ => _.id == this.state.currentItemId)
    }

    componentWillMount(): void {
        if (typeof window !== 'undefined') {
            const timer = window.setInterval(() => { this.tick() }, TIMER_SPEED)
            const cellMatrix = this.currentRoom ? generateCellMatrix(this.currentRoom, cellSize) : undefined
            this.setState({ timer, cellMatrix })
        }
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
        const { characters, characterOrders, thingOrders, sequenceRunning, things, cellMatrix = [] } = this.state
        if (sequenceRunning) {
            return this.setState(continueSequence(this.state, this.props))
        }
        characters.forEach(character => followOrder(character, cellMatrix, characterOrders[character.id]))
        things.forEach(thing => followOrder(thing, cellMatrix, thingOrders[thing.id]))
        return this.setState({ characters, characterOrders })

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
        if (!verb) { return }
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
        const { verbs = [], save, reset, load } = this.props
        const { viewAngle, isPaused,
            characters, things, currentVerbId, currentItemId, items,
            characterOrders, sequenceRunning, thingOrders } = this.state
        const { currentRoom, player } = this
        if (!currentRoom) { return null }

        const characterOrderMap = sequenceRunning ? sequenceRunning[0].characterOrders || {} : characterOrders;
        const thingOrderMap = sequenceRunning ? sequenceRunning[0].thingOrders || {} : thingOrders;

        const charactersAndThings = [...characters, ...things]
            .filter(_ => _.room === currentRoom.name)
            .sort((a, b) => b.y - a.y)

        const roomScale = Math.min(600 / currentRoom.frameWidth, 400 / currentRoom.height)

        return (
            <main>
                {!!save &&
                    <button onClick={() => { save(this.saveData) }}>SAVE</button>
                }
                {!!reset &&
                    <button onClick={() => { reset() }}>RESET</button>
                }
                {!!load &&
                    <button onClick={() => { load() }}>LOAD</button>
                }

                <button onClick={() => { this.setState({ isPaused: !isPaused }) }}>{isPaused ? 'resume' : 'pause'}</button>
                <Room
                    data={currentRoom} scale={roomScale}
                    viewAngle={viewAngle}
                    handleRoomClick={this.handleRoomClick}
                    handleHotspotClick={this.handleTargetClick}
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
                            roomScale={roomScale}
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
                        items={items.filter(_ => _.characterId === player?.id)}
                        currentItemId={currentItemId}
                        select={(item: ItemData) => { this.handleTargetClick(item) }}
                    />
                </>}
            </main>
        )
    }
}
