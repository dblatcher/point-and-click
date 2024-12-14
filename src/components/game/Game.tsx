import { GameStateProvider } from "@/context/game-state-context";
import { useInterval } from "@/hooks/useInterval";
import { gameStateReducer, getInitialGameState, makeDispatcherWithProps } from "@/lib/game-state-logic/game-state-reducer";
import { findById } from "@/lib/util";
import React, { useReducer } from "react";
import { DebugLog } from "../DebugLog";
import { Layout } from "../game-ui/Layout";
import { StoryBoardPlayer } from "../storyboard/StoryBoardPlayer";
import { RoomWrapper } from "./RoomWrapper";
import { GameProps } from "./types";

const TIMER_SPEED = 10

export const Game: React.FunctionComponent<GameProps> = (props) => {
    const [gameState, dispatch] = useReducer(gameStateReducer, getInitialGameState(props))
    const { showDebugLog, uiComponents = {} } = props
    const {
        GameLayoutComponent = Layout,
    } = uiComponents
    const { currentStoryBoardId } = gameState

    const currentStoryBoard = findById(currentStoryBoardId, props.storyBoards ?? [])

    const tick = () => {
        if (gameState.isPaused || currentStoryBoard) { return }
        dispatch({ type: 'TICK-UPDATE', props })
    }
    useInterval(tick, TIMER_SPEED)

    return <GameStateProvider value={{
        gameState,
        gameProps: props,
        updateGameState: makeDispatcherWithProps(dispatch, props),
    }}>
        {showDebugLog && (<DebugLog />)}
        <GameLayoutComponent>
            <RoomWrapper />
        </GameLayoutComponent>
        {(!props.instantMode && currentStoryBoard) && (
            <StoryBoardPlayer storyBoard={currentStoryBoard} />
        )}
    </GameStateProvider>
}
