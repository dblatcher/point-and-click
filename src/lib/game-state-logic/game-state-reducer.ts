import { cloneData } from "@/lib/clone";
import { GameEventEmitter } from "@/lib/game-event-emitter";
import { GameState } from "@/lib/game-state-logic/types";
import { CELL_SIZE, generateCellMatrix } from "@/lib/pathfinding";
import { getViewAngleXCenteredOn, getViewAngleYCenteredOn, locateClickInWorld } from "@/lib/roomFunctions";
import { findById } from "@/lib/util";
import { Command, CommandTarget, ConversationChoice, GameData, Verb } from "point-click-lib";
import { Reducer } from "react";
import { GameProps } from "../../components/game/types";
import { matchInteraction } from "../commandFunctions";
import { DB_VERSION } from "../indexed-db";
import { continueSequence } from "./continueSequence";
import { doPendingInteraction, handleCommand } from "./handleCommand";
import { handleConversationChoice } from "./handleConversationChoice";
import { issueMoveOrder } from "./issueMoveOrder";
import { followOrder } from "./orders/followOrder";
import { makeDebugLogEmitter, makeEventReporter } from "./report-emitting";


export type GameStateAction =
    | { type: 'SET-PAUSED', isPaused: boolean }
    | { type: 'VERB-SELECT', verb: Verb }
    | { type: 'CONVERSATION-CHOICE', choice: ConversationChoice, props: GameProps }
    | { type: 'TARGET-CLICK', target: CommandTarget, props: GameProps }
    | { type: 'HANDLE-HOVER', target: CommandTarget, event: 'enter' | 'leave' }
    | { type: 'ROOM-CLICK', x: number, y: number }
    | { type: 'SEND-COMMAND', command: Command, props: GameProps }
    | { type: 'SET-SCREEN-SIZE', height?: number, width?: number }
    | { type: 'TICK-UPDATE', props: GameProps }
    | { type: 'CLEAR-STORYBOARD' }
    | { type: 'RESTART', props: GameProps }
    | { type: 'HANDLE-LOAD', data: GameData, props: GameProps }

export type ActionWithoutProp =
    | { type: 'SEND-COMMAND', command: Command }
    | { type: 'TARGET-CLICK', target: CommandTarget }
    | { type: 'CONVERSATION-CHOICE', choice: ConversationChoice }
    | { type: 'TICK-UPDATE' }
    | { type: 'RESTART' }
    | { type: 'HANDLE-LOAD', data: GameData }

export const makeDispatcherWithProps =
    (dispatch: React.Dispatch<GameStateAction>, props: GameProps) =>
        (action: GameStateAction | ActionWithoutProp) => {
            switch (action.type) {
                case "SEND-COMMAND":
                case "TARGET-CLICK":
                case "CONVERSATION-CHOICE":
                case "TICK-UPDATE":
                case "RESTART":
                case "HANDLE-LOAD":
                    return dispatch({ ...action, props })
                case "SET-PAUSED":
                case "VERB-SELECT":
                case "HANDLE-HOVER":
                case "ROOM-CLICK":
                case "SET-SCREEN-SIZE":
                case "CLEAR-STORYBOARD":
                    return dispatch(action)
            }
        }

export const getStoryboardCloseAction = (isEndOfGame?: boolean): ActionWithoutProp | GameStateAction => isEndOfGame ? { type: 'RESTART' } : { type: 'CLEAR-STORYBOARD' }

export const screenSizeAction = (width?: number, height?: number): GameStateAction => ({ type: 'SET-SCREEN-SIZE', height, width })

export const gameStateReducer: Reducer<GameState, GameStateAction> = (gameState, action) => {
    const isActive: boolean = !gameState.currentStoryBoardId && !gameState.isPaused && !gameState.sequenceRunning
    const player = gameState.actors.find(actor => actor.isPlayer)
    const currentRoom = findById(gameState.currentRoomId, gameState.rooms)
    const debugLogger = makeDebugLogEmitter(gameState)
    const { reportCommand, reportOrder, reportStage, reportConsequence } = makeEventReporter(gameState)

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

            if (target.type === 'item' && !gameState.currentItemId && verb.preposition) {
                const nonPrepositionalItemInteraction = matchInteraction(
                    { verb, target }, currentRoom, gameState.interactions, gameState
                );
                if (nonPrepositionalItemInteraction) {
                    return {
                        ...gameState,
                        ...handleCommand({ verb, target }, action.props, gameState, debugLogger, reportCommand, reportConsequence)
                    }
                }
                return {
                    ...gameState,
                    currentItemId: target.id
                }
            }

            return {
                ...gameState,
                ...handleCommand({ verb, target, item }, action.props, gameState, debugLogger, reportCommand, reportConsequence)
            }
        }

        case "SEND-COMMAND": {
            return {
                ...gameState,
                ...handleCommand(action.command, action.props, gameState, debugLogger, reportCommand, reportConsequence)
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

            const pointClicked = locateClickInWorld(action.x, action.y, gameState.viewAngleX, gameState.viewAngleY, currentRoom)

            return ({
                ...gameState,
                ...issueMoveOrder(pointClicked, player.id, false, false)(gameState, debugLogger)
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
            const viewAngleXCenteredOnPlayer = (player && currentRoom) ? getViewAngleXCenteredOn(player.x, currentRoom) : undefined
            const viewAngleYCenteredOnPlayer = (player && currentRoom) ? getViewAngleYCenteredOn(player.y, currentRoom) : undefined
            if (gameState.sequenceRunning) {
                return {
                    ...gameState,
                    ...continueSequence(gameState, action.props, reportOrder, reportStage, reportConsequence),
                    viewAngleX: viewAngleXCenteredOnPlayer ?? gameState.viewAngleX,
                    viewAngleY: viewAngleYCenteredOnPlayer ?? gameState.viewAngleY,
                }
            }

            const makeActorsDoOrders = (state: GameState) => {
                const { cellMatrix = [] } = state
                let pendingInteractionShouldBeDone = false;
                state.actors.forEach(actor => {
                    followOrder(
                        actor, cellMatrix,
                        state.actorOrders[actor.id],
                        state,
                        {
                            orderSpeed: action.props.orderSpeed,
                            instantMode: action.props.instantMode,
                            sprite: findById(actor.sprite, action.props._sprites),
                            onOrderStart: order => reportOrder(order, actor),
                            triggerPendingInteraction: () => { pendingInteractionShouldBeDone = true }
                        },
                    )
                })
                if (pendingInteractionShouldBeDone) {
                    doPendingInteraction(state, action.props, debugLogger, reportConsequence)
                }
                return state
            }

            return {
                ...gameState,
                ...makeActorsDoOrders(gameState),
                viewAngleX: viewAngleXCenteredOnPlayer ?? gameState.viewAngleX,
                viewAngleY: viewAngleYCenteredOnPlayer ?? gameState.viewAngleY,
            }
        }

        case "CLEAR-STORYBOARD": {
            return {
                ...gameState,
                currentStoryBoardId: undefined
            }
        }

        case "RESTART": {
            gameState.emitter.emit('prompt-feedback', { message: 'GAME RESTARTED', type: 'system' })
            return getInitialGameState(action.props, gameState.emitter)
        }

        case "HANDLE-LOAD": {
            const roomData = findById(action.data.currentRoomId, action.props.rooms);
            const cellMatrix = roomData ? generateCellMatrix(roomData, CELL_SIZE) : gameState.cellMatrix;
            return {
                ...gameState,
                ...action.data,
                sequenceRunning: action.data.sequenceRunning,
                currentStoryBoardId: action.data.currentStoryBoardId,
                currentConversationId: action.data.currentConversationId,
                pendingInteraction: action.data.pendingInteraction,
                cellMatrix
            }
        }
    }
}

export const getInitialGameState = (props: GameProps, existingEmitter?: GameEventEmitter): GameState => {
    const rooms = props.rooms.map(cloneData);
    const actors = props.actors.map(cloneData);
    const items = props.items.map(cloneData);
    const conversations = props.conversations.map(cloneData);
    const interactions = props.interactions.map(cloneData);
    const flagMap = cloneData(props.flagMap);

    const openingSequenceInProps = findById(props.openingSequenceId, props.sequences)
    const sequenceRunning = (openingSequenceInProps)
        ? cloneData(openingSequenceInProps)
        : undefined;
    const currentStoryBoardId = props.openingStoryboardId;

    const currentRoom = findById(props.currentRoomId, rooms)
    const cellMatrix = currentRoom ? generateCellMatrix(currentRoom, CELL_SIZE) : undefined

    return {
        sequenceRunning,
        currentStoryBoardId,
        actorOrders: {},
        currentConversationId: undefined,
        gameNotBegun: false,

        schemaVersion: DB_VERSION,
        viewAngleX: 0,
        viewAngleY: 0,
        isPaused: props.startPaused || false,
        id: props.id,
        currentRoomId: props.currentRoomId,
        actors,
        rooms,
        currentVerbId: props.verbs[0].id,
        interactions: interactions,
        items,
        conversations,
        flagMap,
        roomHeight: currentRoom?.height ?? 400,
        roomWidth: currentRoom?.width ?? 800,
        emitter: existingEmitter ?? new GameEventEmitter(),
        cellMatrix,
    }
}
