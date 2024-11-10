
import { CommandTarget, GameCondition, GameData } from "@/definitions";
import React, { useReducer } from "react";
import { Sprite } from "@/lib/Sprite";
import { CellMatrix } from "@/lib/pathfinding/cells";
import { buildContentsList } from "@/lib/put-contents-in-order";
import { findById } from "@/lib/util";
import { GameInfoProvider } from "@/context/game-info-provider";
import { GameStateProvider } from "@/context/game-state-context";
import { GameEventEmitter } from "@/lib/game-event-emitter";
import { useInterval } from "@/lib/useInterval";
import { SoundService } from "@/services/soundService";
import { DebugLog } from "../DebugLog";
import { Layout } from "../game-ui/Layout";
import { SaveMenu } from "../game-ui/SaveMenu";
import { Room } from "../svg/Room";
import { gameStateReducer, getInitialGameState } from "./game-state-reducer";
import { UiComponentSet } from "./uiComponentSet";


export type GameProps = Readonly<{
    save?: { (saveDate: GameData, fileName?: string): void };
    reset?: { (): void };
    load?: { (fileName?: string): void };
    deleteSave?: { (fileName: string): void };
    listSavedGames?: { (): string[] };
    _sprites: Sprite[];
    showDebugLog?: boolean;
    startPaused?: boolean;
    uiComponents?: UiComponentSet;
    instantMode?: boolean;
    soundService: SoundService;
} & GameCondition>

export type GameState = GameData & {
    viewAngle: number;
    isPaused: boolean;
    timer?: number;
    cellMatrix?: CellMatrix;
    currentVerbId: string;
    currentItemId?: string;
    hoverTarget?: CommandTarget;

    roomWidth: number;
    roomHeight: number;
    emitter: GameEventEmitter
}

export const cellSize = 5
// use true for debugging only- slows program!
const renderCells = false
const TIMER_SPEED = 10


const getSaveData = (gameState: GameState): GameData => {
    const {
        id,
        rooms, actors, interactions, items,
        currentRoomId, actorOrders, sequenceRunning,
        conversations, currentConversationId, flagMap, gameNotBegun
    } = gameState

    return {
        id,
        rooms, actors, interactions, items,
        currentRoomId, actorOrders, sequenceRunning,
        conversations, currentConversationId, flagMap, gameNotBegun
    }
}


export const FunctionalGame: React.FunctionComponent<GameProps> = (props) => {

    const [gameState, dispatch] = useReducer(gameStateReducer, getInitialGameState(props))

    const tick = () => {
        dispatch({ type: 'TICK-UPDATE', props })
    }

    useInterval(tick, TIMER_SPEED)

    const { deleteSave, save, reset, load, listSavedGames, showDebugLog, uiComponents = {} } = props
    const {
        SaveMenuComponent = SaveMenu,
        GameLayoutComponent = Layout,
    } = uiComponents
    const { viewAngle, isPaused, roomHeight, roomWidth } = gameState


    const ending = findById(gameState.endingId, props.endings)
    const currentRoom = findById(gameState.currentRoomId, gameState.rooms)
    const currentVerb = findById(gameState.currentVerbId, props.verbs);


    const handleTargetClick = (target: CommandTarget) => {
        console.log('click', target.id)
        dispatch({ type: 'TARGET-CLICK', props, target })
    }

    const handleHover = (target: CommandTarget, event: 'enter' | 'leave') => {
        dispatch({ type: 'HANDLE-HOVER', event, target })
    }

    const contentList = buildContentsList(
        gameState,
        handleTargetClick
    )


    return <GameStateProvider value={gameState}>
        <GameInfoProvider value={{ ...props, verb: currentVerb, ending }}>
            {showDebugLog && (<DebugLog />)}
            <GameLayoutComponent
                selectVerb={(verb) => { dispatch({ type: 'VERB-SELECT', verb }) }}
                selectConversation={(choice) => { dispatch({ type: 'CONVERSATION-CHOICE', choice, props }) }}
                selectItem={handleTargetClick}
                handleHover={handleHover}
                setScreenSize={(width, height) => { dispatch({ type: 'SET-SCREEN-SIZE', width, height }) }}
                sendCommand={(command) => {
                    dispatch({ type: 'SEND-COMMAND', command, props })
                }}
                saveMenu={
                    <SaveMenuComponent
                        load={load ? (fileName) => { load(fileName) } : undefined}
                        reset={reset ? () => { reset() } : undefined}
                        save={save ? (fileName) => { save(getSaveData(gameState), fileName) } : undefined}
                        deleteSave={deleteSave}
                        listSavedGames={listSavedGames}
                        isPaused={isPaused}
                        setIsPaused={(isPaused) => { dispatch({ type: 'SET-PAUSED', isPaused }) }}
                    />
                }
            >
                {currentRoom && (
                    <Room
                        data={currentRoom}
                        maxWidth={roomWidth}
                        maxHeight={roomHeight}
                        isPaused={isPaused}
                        viewAngle={viewAngle}
                        handleRoomClick={(x, y) => { dispatch({ type: 'ROOM-CLICK', x, y }) }}
                        handleHotspotClick={handleTargetClick}
                        handleHover={handleHover}
                        contents={contentList}
                        obstacleCells={renderCells ? gameState.cellMatrix : undefined}
                    />
                )
                }
            </GameLayoutComponent>
        </GameInfoProvider>
    </GameStateProvider>
}
