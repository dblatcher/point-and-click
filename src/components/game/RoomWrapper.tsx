import { useGameState, useGameStateDerivations } from "@/context/game-state-context";
import { CommandTarget } from "point-click-lib";
import { findById } from "@/lib/util";
import React from "react";
import { PersistentSound } from "../sound/PersistentSound";
import { Room } from "../svg/Room";
import { buildActorListSortedForDisplay } from "./put-contents-in-order";
import { useAssets } from "@/context/asset-context";


interface Props {
    noInteraction?: boolean;
    renderCells?: boolean; // use true for debugging only- slows program!
}

export const RoomWrapper: React.FunctionComponent<Props> = ({ noInteraction, renderCells }) => {
    const { gameState, updateGameState, gameProps } = useGameState()
    const { currentStoryBoard } = useGameStateDerivations()
    const { getImageAsset } = useAssets();
    const { viewAngleX, viewAngleY, isPaused, roomHeight, roomWidth } = gameState
    const currentRoom = findById(gameState.currentRoomId, gameState.rooms)

    const handleTargetClick = noInteraction ? () => { } : (target: CommandTarget) => {
        updateGameState({ type: 'TARGET-CLICK', target })
    }

    const handleRoomClick = noInteraction ? () => { } : (x: number, y: number) => { updateGameState({ type: 'ROOM-CLICK', x, y }) };

    const orderedActors = buildActorListSortedForDisplay(
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
                orderedActors={orderedActors}
                obstacleCells={renderCells ? gameState.cellMatrix : undefined}
                getImageAsset={getImageAsset}
                orderSpeed={gameProps.orderSpeed}
                sprites={gameProps.sprites}
            />
        )}
        <PersistentSound isPaused={isPaused} soundValue={currentRoom?.backgroundMusic} />
        <PersistentSound isPaused={isPaused} soundValue={currentRoom?.ambientNoise} />
    </>

}