import { useGameState, useGameStateDerivations } from "@/context/game-state-context";
import { CommandTarget } from "@/definitions";
import { findById } from "@/lib/util";
import React from "react";
import { PersistentSound } from "../sound/PersistentSound";
import { Room } from "../svg/Room";
import { buildContentsList } from "./put-contents-in-order";


interface Props {
    noInteraction?: boolean;
    renderCells?: boolean; // use true for debugging only- slows program!
}

export const RoomWrapper: React.FunctionComponent<Props> = ({ noInteraction, renderCells }) => {
    const { gameState, updateGameState } = useGameState()
    const { currentStoryBoard } = useGameStateDerivations()
    const { viewAngleX, viewAngleY, isPaused, roomHeight, roomWidth } = gameState
    const currentRoom = findById(gameState.currentRoomId, gameState.rooms)

    const handleTargetClick = noInteraction ? () => { } : (target: CommandTarget) => {
        updateGameState({ type: 'TARGET-CLICK', target })
    }

    const handleRoomClick = noInteraction ? () => { } : (x: number, y: number) => { updateGameState({ type: 'ROOM-CLICK', x, y }) };

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
                viewAngleX={viewAngleX}
                viewAngleY={viewAngleY}
                handleRoomClick={handleRoomClick}
                handleHotspotClick={handleTargetClick}
                handleHover={(target: CommandTarget, event: 'enter' | 'leave') => {
                    updateGameState({ type: 'HANDLE-HOVER', event, target })
                }}
                contents={contentList}
                obstacleCells={renderCells ? gameState.cellMatrix : undefined}
            />
        )}
        <PersistentSound isPaused={isPaused} soundValue={currentRoom?.backgroundMusic} />
        <PersistentSound isPaused={isPaused} soundValue={currentRoom?.ambientNoise} />
    </>

}