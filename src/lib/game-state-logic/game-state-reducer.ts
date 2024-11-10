import { Verb, ConversationChoice, CommandTarget, Command } from "@/definitions"
import { locateClickInWorld, getViewAngleCenteredOn } from "@/lib/roomFunctions"
import { findById } from "@/lib/util"
import { Reducer } from "react"
import { GameState } from "@/lib/game-state-logic/types";
import { CELL_SIZE } from "@/lib/pathfinding/constants";
import { GameProps } from "../../components/game/types"
import { continueSequence } from "./continueSequence"
import { handleCommand, doPendingInteraction } from "./handleCommand"
import { handleConversationChoice } from "./handleConversationChoice"
import { issueMoveOrder } from "./issueMoveOrder"
import { followOrder } from "./orders/followOrder"
import { cloneData } from "@/lib/clone"
import { generateCellMatrix } from "@/lib/pathfinding/cells"
import { GameEventEmitter } from "@/lib/game-event-emitter"


type GameStateAction =
    | { type: 'SET-PAUSED', isPaused: boolean }
    | { type: 'VERB-SELECT', verb: Verb }
    | { type: 'CONVERSATION-CHOICE', choice: ConversationChoice, props: GameProps }
    | { type: 'TARGET-CLICK', target: CommandTarget, props: GameProps }
    | { type: 'HANDLE-HOVER', target: CommandTarget, event: 'enter' | 'leave' }
    | { type: 'ROOM-CLICK', x: number, y: number }
    | { type: 'SEND-COMMAND', command: Command, props: GameProps }
    | { type: 'SET-SCREEN-SIZE', height?: number, width?: number }
    | { type: 'TICK-UPDATE', props: GameProps }


export const gameStateReducer: Reducer<GameState, GameStateAction> = (gameState, action) => {
    // const gameState = cloneData(_gameState)
    const isActive: boolean = !gameState.endingId && !gameState.isPaused && !gameState.sequenceRunning
    const player = gameState.actors.find(actor => actor.isPlayer)
    const currentRoom = findById(gameState.currentRoomId, gameState.rooms)

    switch (action.type) {
        case 'SET-PAUSED': {
            return {
                ...gameState,
                isPaused: action.isPaused
            }
        }

        case 'VERB-SELECT': {
            if (!isActive) { return gameState }
            return {
                ...gameState,
                currentVerbId: action.verb.id,
                currentItemId: undefined,
            }
        }

        case "CONVERSATION-CHOICE": {
            if (!isActive) { return gameState }
            return {
                ...gameState,
                ...handleConversationChoice(action.choice, action.props.sequences)(gameState),
            }
        }

        case "TARGET-CLICK": {
            const { target } = action
            if (!isActive || gameState.currentConversationId) { return gameState }
            const verb = findById(gameState.currentVerbId, action.props.verbs)
            if (!verb) { return gameState }
            const item = findById(gameState.currentItemId, gameState.items)

            if (target.type === 'item' && target.id === gameState.currentItemId) {
                return {
                    ...gameState,
                    currentItemId: undefined
                }
            }

            // TO DO - handle 'USE $ITEM' as target with no other $ITEM
            // could check interactions
            if (target.type === 'item' && !gameState.currentItemId && verb.preposition) {
                return {
                    ...gameState,
                    currentItemId: target.id
                }
            }

            return {
                ...gameState,
                ...handleCommand({ verb, target, item }, action.props)(gameState)
            }
        }

        case "SEND-COMMAND": {
            return {
                ...gameState,
                ...handleCommand(action.command, action.props)(gameState)
            }
        }

        case "HANDLE-HOVER": {
            return {
                ...gameState,
                hoverTarget: action.event === 'enter' ? action.target : undefined
            }
        }

        case "ROOM-CLICK": {
            if (!isActive || gameState.currentConversationId) { return gameState }
            const { sequenceRunning } = gameState
            if (sequenceRunning) { return gameState }
            if (!player || !currentRoom) { return gameState }

            const pointClicked = locateClickInWorld(action.x, action.y, gameState.viewAngle, currentRoom)

            return ({
                ...gameState,
                ...issueMoveOrder(pointClicked, player.id, false, false)(gameState)
            })
        }

        case "SET-SCREEN-SIZE": {
            return {
                ...gameState,
                roomHeight: action.height ?? gameState.roomHeight,
                roomWidth: action.width ?? gameState.roomWidth,
            }
        }

        case "TICK-UPDATE": {
            const { isPaused } = gameState
            if (isPaused) { return gameState }

            const viewAngleCenteredOnPlayer = (player && currentRoom) ? getViewAngleCenteredOn(player.x, currentRoom) : undefined

            if (gameState.sequenceRunning) {
                return {
                    ...gameState,
                    ...continueSequence(gameState, action.props),
                    viewAngle: viewAngleCenteredOnPlayer ?? gameState.viewAngle
                }
            }

            const makeActorsDoOrders = (state: GameState) => {
                const { cellMatrix = [] } = state
                let pendingInteractionShouldBeDone = false;
                state.actors.forEach(actor => {
                    const triggersPendingInteraction = followOrder(
                        actor, cellMatrix,
                        state.actorOrders[actor.id],
                        state,
                        findById(actor.sprite, action.props._sprites),
                        action.props.instantMode
                    )
                    if (triggersPendingInteraction) {
                        pendingInteractionShouldBeDone = true
                    }
                })
                if (pendingInteractionShouldBeDone) {
                    doPendingInteraction(state, action.props)
                }
                return state
            }

            return {
                ...gameState,
                ...makeActorsDoOrders(gameState),
                viewAngle: viewAngleCenteredOnPlayer ?? gameState.viewAngle
            }
        }
    }
}

export const getInitialGameState = (props: GameProps): GameState => {
    const rooms = props.rooms.map(cloneData);
    const actors = props.actors.map(cloneData);
    const items = props.items.map(cloneData);
    const conversations = props.conversations.map(cloneData);
    const flagMap = cloneData(props.flagMap);
    const openingSequenceInProps = findById(props.openingSequenceId, props.sequences)
    const openingSequenceCopy = (openingSequenceInProps && props.gameNotBegun)
        ? cloneData(openingSequenceInProps)
        : undefined


    const currentRoom = findById(props.currentRoomId, rooms)
    const cellMatrix = currentRoom ? generateCellMatrix(currentRoom, CELL_SIZE) : undefined

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
        flagMap,
        gameNotBegun: false,

        roomHeight: 400,
        roomWidth: 800,

        emitter: new GameEventEmitter(),
        cellMatrix,
    }
}
