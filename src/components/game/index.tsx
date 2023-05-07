
import { Component } from "react";
import { GameData, GameCondition, RoomData, ActorData, Verb, CommandTarget, ItemData, Order, Conversation, ConversationChoice, Ending } from "@/definitions";
//lib
import { getViewAngleCenteredOn, locateClickInWorld, putActorsInDisplayOrder } from "@/lib/roomFunctions";
import { clamp, findById } from "@/lib/util";
import { cloneData } from "@/lib/clone";
import { Sprite } from "@/lib/Sprite";
import { CellMatrix, generateCellMatrix } from "@/lib/pathfinding/cells";
import { makeDebugEntry, type LogEntry } from "@/lib/inGameDebugging";
// state logic
import { followOrder } from "./orders/followOrder";
import { issueMoveOrder } from "./issueMoveOrder";
import { doPendingInteraction, handleCommand } from "./handleCommand";
import { continueSequence } from "./continueSequence";
import { handleConversationChoice } from "./handleConversationChoice";
// components
import { Room } from "../svg/Room";
import { DebugLog } from "../DebugLog";
import { VerbMenu } from "../game-ui/VerbMenu";
import { ItemMenu } from "../game-ui/ItemMenu";
import { CommandLine } from "../game-ui/CommandLine";
import { ConversationMenu } from "../game-ui/ConversationMenu";
import { EndingScreen } from "../game-ui/EndingScreen";
import { SoundToggle } from "../game-ui/SoundToggle";
import { SaveMenu } from "../game-ui/SaveMenu";
import { UiComponentSet } from "./uiComponentSet";
import { Layout } from "../game-ui/Layout";


export type GameProps = Readonly<{
    save?: { (saveDate: GameData): void };
    reset?: { (): void };
    load?: { (): void };
    showDebugLog?: boolean;
    startPaused?: boolean;
    uiComponents?: UiComponentSet;
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
    data: ActorData;
    orders?: Order[];
    clickHandler?: HandleClickFunction<ActorData>;
    overrideSprite?: Sprite;
}

export const cellSize = 5
// use true for debugging only- slows program!
const renderCells = false
const TIMER_SPEED = 10

export default class Game extends Component<GameProps, GameState> {

    constructor(props: GameProps) {
        super(props)
        //TO DO - integrity check - no duplicate ids

        this.state = this.getInitialGameState(props)

        this.tick = this.tick.bind(this)
        this.handleRoomClick = this.handleRoomClick.bind(this)
        this.handleConversationClick = this.handleConversationClick.bind(this)
        this.handleTargetClick = this.handleTargetClick.bind(this)
        this.makeActorsAct = this.makeActorsAct.bind(this)
        this.centerViewOnPLayer = this.centerViewOnPLayer.bind(this)
        this.handleHover = this.handleHover.bind(this)
    }

    getInitialGameState(props: GameProps): GameState {
        const rooms = props.rooms.map(cloneData);
        const actors = props.actors.map(cloneData);
        const items = props.items.map(cloneData);
        const conversations = props.conversations.map(cloneData);
        const flagMap = cloneData(props.flagMap);
        const openingSequenceInProps = findById(props.openingSequenceId, props.sequences)
        const openingSequenceCopy = (openingSequenceInProps && props.gameNotBegun)
            ? cloneData(openingSequenceInProps)
            : undefined

        return {
            viewAngle: 0,
            isPaused: props.startPaused || false,
            id: props.id,
            currentRoomId: props.currentRoomId,
            actors,
            rooms,
            currentVerbId: props.verbs[0].id,
            interactions: [...props.interactions],
            items,
            sequenceRunning: props.sequenceRunning || openingSequenceCopy,
            actorOrders: props.actorOrders || {},
            conversations,
            currentConversationId: props.currentConversationId,
            debugLog: [makeDebugEntry(`Running: ${props.id}`)],
            flagMap,
            gameNotBegun: false,
        }
    }

    get saveData(): GameData {
        const {
            rooms, actors, interactions, items,
            currentRoomId, actorOrders, sequenceRunning,
            conversations, currentConversationId, id, flagMap, gameNotBegun
        } = this.state

        return {
            id,
            rooms, actors, interactions, items,
            currentRoomId, actorOrders, sequenceRunning,
            conversations, currentConversationId, flagMap, gameNotBegun
        }
    }

    get player(): (ActorData | undefined) {
        return this.state.actors.find(actor => actor.isPlayer)
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

    componentDidMount(): void {
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
        this.makeActorsAct()
        this.centerViewOnPLayer()
    }

    makeActorsAct() {
        if (this.state.sequenceRunning) {
            return this.setState(continueSequence(this.state, this.props))
        }

        return this.setState(state => {
            const { cellMatrix = [] } = state
            let pendingInteractionShouldBeDone = false;
            state.actors.forEach(actor => {
                const triggersPendingInteraction = followOrder(actor, cellMatrix, state.actorOrders[actor.id], state)
                if (triggersPendingInteraction) {
                    pendingInteractionShouldBeDone = true
                }
            })
            if (pendingInteractionShouldBeDone) {
                doPendingInteraction(state, this.props)
            }
            return state
        })
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
        const { verbs = [], save, reset, load, showDebugLog, uiComponents = {} } = this.props
        const {
            CommandLineComponent = CommandLine,
            VerbMenuComponent = VerbMenu,
            ItemMenuComponent = ItemMenu,
            SaveMenuComponent = SaveMenu,
            ConversationMenuComponent = ConversationMenu,
            SoundToggleComponent = SoundToggle,
            GameLayoutComponent = Layout,
        } = uiComponents
        const { viewAngle, isPaused,
            actors, currentVerbId, currentItemId, items,
            actorOrders, sequenceRunning, hoverTarget
        } = this.state
        const { currentRoom, player, currentConversation } = this

        const actorOrderMap = sequenceRunning ? sequenceRunning.stages[0].actorOrders || {} : actorOrders;

        const actorsInOrder = actors
            .filter(_ => _.room === currentRoom?.id)
            .sort(putActorsInDisplayOrder)

        const contentList: RoomContentItem[] = actorsInOrder.map(data => ({
            data,
            orders: actorOrderMap[data.id],
            clickHandler: (data.isPlayer || data.noInteraction) ? undefined : this.handleTargetClick
        }))

        return <>
            {showDebugLog && (
                <DebugLog
                    condition={{
                        verbs,
                        sequences: this.props.sequences,
                        sprites: this.props.sprites,
                        endings: this.props.endings,
                        ...this.state,
                    }}
                    log={this.state.debugLog} />
            )}
            <GameLayoutComponent
                isConversationRunning={!!currentConversation}
                isSequenceRunning={!!sequenceRunning}
                isGameEnded={!!this.ending}
                itemMenu={<ItemMenuComponent
                    items={items.filter(_ => _.actorId === player?.id)}
                    currentItemId={currentItemId}
                    select={(item: ItemData) => { this.handleTargetClick(item) }}
                    handleHover={this.handleHover}
                />}
                commandLine={<CommandLineComponent
                    verb={this.currentVerb}
                    item={this.currentItem}
                    hoverTarget={hoverTarget}
                />}
                verbMenu={
                    <VerbMenuComponent
                        verbs={verbs}
                        currentVerbId={currentVerbId}
                        select={(verb: Verb) => { this.setState({ currentVerbId: verb.id, currentItemId: undefined }) }}
                    />
                }
                conversationMenu={
                    currentConversation && (
                        <ConversationMenuComponent
                            conversation={currentConversation}
                            select={this.handleConversationClick}
                        />
                    )
                }
                endingScreen={this.ending && <EndingScreen ending={this.ending} />}
                saveMenu={
                    <SaveMenuComponent
                        load={load ? () => { load() } : undefined}
                        reset={reset ? () => { reset() } : undefined}
                        save={save ? () => { save(this.saveData) } : undefined}
                        isPaused={isPaused}
                        setIsPaused={(isPaused) => { this.setState({ isPaused }) }}
                    />
                }
                soundToggle={<SoundToggleComponent />}
            >
                {currentRoom && (
                    <Room
                        data={currentRoom}
                        maxWidth={600} maxHeight={400}
                        isPaused={isPaused}
                        viewAngle={viewAngle}
                        handleRoomClick={this.handleRoomClick}
                        handleHotspotClick={this.handleTargetClick}
                        handleHover={this.handleHover}
                        contents={contentList}
                        obstacleCells={renderCells ? this.state.cellMatrix : undefined}
                    />
                )
                }
            </GameLayoutComponent>
        </>

    }
}