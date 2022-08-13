/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h, Fragment } from "preact";
import { GameData, GameCondition, RoomData, CharacterData, Verb, CommandTarget, ItemData, Order, Conversation, ConversationChoice, Ending } from "src";
import { getViewAngleCenteredOn, clamp, locateClickInWorld, findById } from "../../lib/util";
import { CellMatrix, generateCellMatrix } from "../../lib/pathfinding/cells";
import { followOrder } from "./orders/followOrder";
import { issueMoveOrder } from "./issueMoveOrder";
import { handleCommand } from "./handleCommand";
import { Room } from "../Room";
import { VerbMenu } from "../VerbMenu";
import { ItemMenu } from "../ItemMenu";
import { CommandLine } from "../CommandLine";
import { cloneData } from "../../lib/clone";
import { continueSequence } from "./continueSequence";
import { Sprite } from "src/lib/Sprite";
import { ConversationMenu } from "../ConversationMenu";
import { handleConversationChoice } from "./handleConversationChoice";
import { EndingScreen } from "../EndingScreen";
import { DebugLog, makeDebugEntry, type LogEntry } from "../DebugLog";


export type GameProps = Readonly<{
    save?: { (saveDate: GameData): void };
    reset?: { (): void };
    load?: { (): void };
    showDebugLog?: boolean;
} & GameCondition>

export type GameState = GameData & {
    viewAngle: number;
    isPaused: boolean;
    timer?: number;
    cellMatrix?: CellMatrix;
    currentVerbId: string;
    currentItemId?: string;
    hoverTarget?: CommandTarget;

    debugLog: LogEntry[];
}

export type HandleHoverFunction = { (target: CommandTarget, event: 'enter' | 'leave'): void };
export type HandleClickFunction<T extends CommandTarget> = { (target: T): void };
export type RoomContentItem = {
    data: CharacterData;
    orders?: Order[];
    clickHandler?: HandleClickFunction<CharacterData>;
    overrideSprite?: Sprite;
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
        this.handleConversationClick = this.handleConversationClick.bind(this)
        this.handleTargetClick = this.handleTargetClick.bind(this)
        this.makeCharactersAct = this.makeCharactersAct.bind(this)
        this.centerViewOnPLayer = this.centerViewOnPLayer.bind(this)
        this.handleHover = this.handleHover.bind(this)
    }

    getInitialGameState(props: GameProps): GameState {
        const rooms = props.rooms.map(cloneData);
        const characters = props.characters.map(cloneData);
        const items = props.items.map(cloneData);
        const conversations = props.conversations.map(cloneData);

        return {
            viewAngle: 0,
            isPaused: false,
            id: props.id,
            currentRoomId: props.currentRoomId,
            characters,
            rooms,
            currentVerbId: props.verbs[0].id,
            interactions: [...props.interactions],
            items,
            sequenceRunning: props.sequenceRunning || undefined,
            characterOrders: props.characterOrders || {},
            conversations,
            currentConversationId: props.currentConversationId,
            debugLog: [makeDebugEntry("Running!")]
        }
    }

    get saveData(): GameData {
        const {
            rooms, characters, interactions, items,
            currentRoomId, characterOrders, sequenceRunning,
            conversations, currentConversationId, id,
        } = this.state

        return {
            id,
            rooms, characters, interactions, items,
            currentRoomId, characterOrders, sequenceRunning,
            conversations, currentConversationId,
        }
    }

    get player(): (CharacterData | undefined) {
        return this.state.characters.find(character => character.isPlayer)
    }

    get currentConversation(): (Conversation | undefined) {
        const { conversations, currentConversationId } = this.state
        return conversations.find(conversation => conversation.id === currentConversationId)
    }

    get currentRoom(): (RoomData | undefined) {
        const { currentRoomId, rooms } = this.state
        return rooms.find(_ => _.id === currentRoomId)
    }

    get currentVerb(): Verb | undefined {
        if (!this.state.currentVerbId) { return undefined }
        return this.props.verbs.find(_ => _.id == this.state.currentVerbId)
    }

    get currentItem(): ItemData | undefined {
        if (!this.state.currentItemId) { return undefined }
        return this.state.items.find(_ => _.id == this.state.currentItemId)
    }

    get ending(): Ending | undefined {
        return findById(this.state.endingId, this.props.endings)
    }

    get isActive(): boolean {
        return !this.ending && !this.state.isPaused && !this.state.sequenceRunning
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
        const { characters, characterOrders, sequenceRunning, cellMatrix = [] } = this.state
        if (sequenceRunning) {
            return this.setState(continueSequence(this.state, this.props))
        }
        characters.forEach(character => followOrder(character, cellMatrix, characterOrders[character.id]))
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
        if (!this.isActive || this.currentConversation) { return }
        const { currentVerbId, currentItemId, items } = this.state
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

    handleConversationClick(choice: ConversationChoice) {
        if (!this.isActive) { return }
        this.setState(handleConversationChoice(choice, this.props.sequences))
    }

    handleRoomClick(x: number, y: number) {
        if (!this.isActive || this.currentConversation) { return }
        const { sequenceRunning } = this.state
        if (sequenceRunning) { return }
        const { player, currentRoom } = this
        if (!player || !currentRoom) { return }
        const pointClicked = locateClickInWorld(x, y, this.state.viewAngle, currentRoom)
        this.setState(issueMoveOrder(pointClicked, player.id, false, false))
    }

    handleHover(target: CommandTarget, event: 'enter' | 'leave') {
        if (event === 'enter') {
            return this.setState({ hoverTarget: target })
        }
        if (event === 'leave' && target.id === this.state.hoverTarget?.id) {
            return this.setState({ hoverTarget: undefined })
        }
    }

    render() {
        const { verbs = [], save, reset, load, showDebugLog } = this.props
        const { viewAngle, isPaused,
            characters, currentVerbId, currentItemId, items,
            characterOrders, sequenceRunning, hoverTarget
        } = this.state
        const { currentRoom, player, currentConversation } = this

        const characterOrderMap = sequenceRunning ? sequenceRunning.stages[0].characterOrders || {} : characterOrders;

        const charactersInOrder = characters
            .filter(_ => _.room === currentRoom?.id)
            .sort((a, b) => b.y - a.y)

        const contentList: RoomContentItem[] = charactersInOrder.map(data => ({
            data,
            orders: characterOrderMap[data.id],
            clickHandler: data.type == 'character' && data.isPlayer ? undefined : this.handleTargetClick
        }))

        return (<>
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
                {currentRoom &&
                    <Room
                        data={currentRoom}
                        maxWidth={600} maxHeight={400}
                        isPaused={isPaused}
                        viewAngle={viewAngle}
                        handleRoomClick={this.handleRoomClick}
                        handleHotspotClick={this.handleTargetClick}
                        handleHover={this.handleHover}
                        contents={contentList}
                    // use for debugging - slows render!
                    // obstacleCells={this.state.cellMatrix}
                    />
                }

                {(!sequenceRunning && currentConversation) && (
                    <ConversationMenu
                        conversation={currentConversation}
                        select={this.handleConversationClick}
                    />
                )}

                {this.ending && <EndingScreen ending={this.ending} />}

                {(!sequenceRunning && !currentConversation && !this.ending) && <>
                    <CommandLine
                        verb={this.currentVerb}
                        item={this.currentItem}
                        hoverTarget={hoverTarget}
                    />

                    <VerbMenu
                        verbs={verbs}
                        currentVerbId={currentVerbId}
                        select={(verb: Verb) => { this.setState({ currentVerbId: verb.id, currentItemId: undefined }) }}
                    />

                    <ItemMenu
                        items={items.filter(_ => _.characterId === player?.id)}
                        currentItemId={currentItemId}
                        select={(item: ItemData) => { this.handleTargetClick(item) }}
                        handleHover={this.handleHover}
                    />
                </>}
            </main>
            {showDebugLog && (
                <DebugLog
                    condition={{
                        verbs,
                        sequences: this.props.sequences,
                        sprites: this.props.sprites,
                        spriteSheets: this.props.spriteSheets,
                        endings: this.props.endings,
                        ...this.state,
                    }}
                    log={this.state.debugLog} />
            )}
        </>
        )
    }
}
