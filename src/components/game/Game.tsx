import { GameInfoProvider } from "@/context/game-info-provider";
import { GameStateProvider } from "@/context/game-state-context";
import { CommandTarget } from "@/definitions";
import { useInterval } from "@/hooks/useInterval";
import { gameStateReducer, getInitialGameState } from "@/lib/game-state-logic/game-state-reducer";
import { getSaveData } from "@/lib/game-state-logic/state-to-save-data";
import { buildContentsList } from "@/components/game/put-contents-in-order";
import { findById } from "@/lib/util";
import React, { useReducer } from "react";
import { DebugLog } from "../DebugLog";
import { Layout } from "../game-ui/Layout";
import { SaveMenu } from "../game-ui/SaveMenu";
import { Room } from "../svg/Room";
import { GameProps } from "./types";
import { StoryBoardPlayer } from "../StoryBoardPlayer";

// use true for debugging only- slows program!
const renderCells = false
const TIMER_SPEED = 10

export const Game: React.FunctionComponent<GameProps> = (props) => {
    const [gameState, dispatch] = useReducer(gameStateReducer, getInitialGameState(props))

    const { deleteSave, save, reset, load, listSavedGames, showDebugLog, uiComponents = {} } = props
    const {
        SaveMenuComponent = SaveMenu,
        GameLayoutComponent = Layout,
    } = uiComponents
    const { viewAngle, isPaused, roomHeight, roomWidth, currentStoryBoardId } = gameState

    const ending = findById(gameState.endingId, props.endings)
    const currentRoom = findById(gameState.currentRoomId, gameState.rooms)
    const currentVerb = findById(gameState.currentVerbId, props.verbs);
    const currentStoryBoard = findById(currentStoryBoardId, props.storyBoards ?? [])

    const tick = () => {
        if (gameState.isPaused || currentStoryBoard) { return }
        dispatch({ type: 'TICK-UPDATE', props })
    }
    useInterval(tick, TIMER_SPEED)

    const handleTargetClick = (target: CommandTarget) => {
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
                {(currentRoom && !currentStoryBoard) && (
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
                )}

                {currentStoryBoard && (
                    <StoryBoardPlayer
                        storyBoard={currentStoryBoard}
                        confirmDone={() => dispatch({ type: 'CLEAR-STORYBOARD' })}
                    />
                )}
            </GameLayoutComponent>
        </GameInfoProvider>
    </GameStateProvider>
}
