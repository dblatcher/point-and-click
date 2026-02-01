import { GameStateProvider } from "@/context/game-state-context";
import { useInterval } from "@/hooks/useInterval";
import { makeDispatcherWithProps } from "@/lib/game-state-logic/game-state-actions";
import { gameStateReducer, getInitialGameState } from "@/lib/game-state-logic/game-state-reducer";
import { findById } from "@/lib/util";
import React, { useReducer } from "react";
import { DebugLog } from "../DebugLog";
import { SimpleLayout } from "../game-simple-ui/Layout";
import { StoryBoardPlayer } from "../storyboard/StoryBoardPlayer";
import { GameProps } from "./types";
import { useCamera } from "@/hooks/useCamera";
import { getPointOfFocus } from "point-click-lib";
import { CamerPointProvider } from "point-click-components";


export const Game: React.FunctionComponent<GameProps> = (props) => {
    const [gameState, dispatch] = useReducer(gameStateReducer, getInitialGameState(props))
    const { updateCamera, cameraPoint } = useCamera()
    const { showDebugLog, uiComponents = {}, timerInterval = 10 } = props
    const {
        GameLayoutComponent = SimpleLayout,
    } = uiComponents
    const { currentStoryBoardId } = gameState

    const currentStoryBoard = findById(currentStoryBoardId, props.storyBoards)

    const tick = () => {
        if (gameState.isPaused || currentStoryBoard) { return }
        dispatch({ type: 'TICK-UPDATE', props })
        const { x, y } = getPointOfFocus(gameState) ?? { x: gameState.viewAngleX, y: gameState.viewAngleY }
        updateCamera(x, y, gameState.currentRoomId)
    }
    useInterval(tick, timerInterval)

    return <GameStateProvider value={{
        gameState,
        gameProps: props,
        updateGameState: makeDispatcherWithProps(dispatch, props),
    }}>
        <CamerPointProvider value={{cameraPoint}}>
            {showDebugLog && (<DebugLog />)}
            <GameLayoutComponent />
            {(!props.instantMode && currentStoryBoard) && (
                <StoryBoardPlayer storyBoard={currentStoryBoard} />
            )}
        </CamerPointProvider>
    </GameStateProvider>
}
