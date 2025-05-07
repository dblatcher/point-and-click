import { useGameState } from "@/context/game-state-context";
import { findById } from "@/lib/util";
import React from "react";
import { Room } from "../svg/Room";
import { CommandTarget } from "@/definitions";
import { buildContentsList } from "./put-contents-in-order";


// use true for debugging only- slows program!
const renderCells = false

export const RoomWrapper: React.FunctionComponent = () => {
    const { gameProps, gameState, updateGameState } = useGameState()
    const { viewAngle, isPaused, roomHeight, roomWidth, currentStoryBoardId } = gameState
    const currentRoom = findById(gameState.currentRoomId, gameState.rooms)
    const currentStoryBoard = findById(currentStoryBoardId, gameProps.storyBoards)

    const handleTargetClick = (target: CommandTarget) => {
        updateGameState({ type: 'TARGET-CLICK', target })
    }

    const contentList = buildContentsList(
        gameState,
        handleTargetClick
    )

    return <>
        {(currentRoom && !currentStoryBoard) && (
            <Room
                data={currentRoom}
                maxWidth={roomWidth}
                maxHeight={roomHeight}
                isPaused={isPaused}
                viewAngle={viewAngle}
                handleRoomClick={(x, y) => { updateGameState({ type: 'ROOM-CLICK', x, y }) }}
                handleHotspotClick={handleTargetClick}
                handleHover={(target: CommandTarget, event: 'enter' | 'leave') => {
                    updateGameState({ type: 'HANDLE-HOVER', event, target })
                }}
                contents={contentList}
                obstacleCells={renderCells ? gameState.cellMatrix : undefined}
            />
        )}
    </>

}