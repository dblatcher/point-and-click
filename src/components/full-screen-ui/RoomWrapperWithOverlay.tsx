import { useGameState } from "@/context/game-state-context";
import { findById } from "@/lib/util";
import React, { useEffect, useState } from "react";
import { Room } from "../svg/Room";
import { ActorData, CommandTarget, HotspotZone } from "@/definitions";
import { buildContentsList } from "../game/put-contents-in-order";
import { ParallaxPlace, ParallaxPlaceProps } from "../svg/ParallaxPlace";
import { GameState } from "@/lib/game-state-logic/types";
import { calculateScreenX } from "@/lib/roomFunctions";
import { TargetLabel } from "./TargetLabel";
import { InteractionCoin } from "./InteractionCoin";


const getHoverTarget = (gameState: GameState): ActorData | HotspotZone | undefined => {
    return gameState.hoverTarget?.type === 'actor' || gameState.hoverTarget?.type === 'hotspot'
        ? gameState.hoverTarget
        : undefined
}

const getTargetPlace = (hoverTargetInRoom: ActorData | HotspotZone | undefined, gameState: GameState) => {
    const currentRoom = findById(gameState.currentRoomId, gameState.rooms)
    if (!currentRoom || !hoverTargetInRoom) {
        return undefined
    }

    if (hoverTargetInRoom.type === 'hotspot') {
        const labelProps: ParallaxPlaceProps = {
            x: hoverTargetInRoom.x,
            y: hoverTargetInRoom.y,
            parallax: hoverTargetInRoom.parallax,
            roomData: currentRoom,
            viewAngle: gameState.viewAngle,
        }
        return labelProps
    }

    const labelProps: ParallaxPlaceProps = {
        x: calculateScreenX(hoverTargetInRoom.x - (hoverTargetInRoom.width / 2), gameState.viewAngle, currentRoom),
        y: hoverTargetInRoom.y,
        parallax: 0,
        roomData: currentRoom,
        viewAngle: gameState.viewAngle,
    }
    return labelProps
}


// use true for debugging only- slows program!
const renderCells = false

export const RoomWrapperWithOverlay: React.FunctionComponent = () => {
    const { gameProps, gameState, updateGameState } = useGameState()
    const { viewAngle, isPaused, roomHeight, roomWidth, currentStoryBoardId } = gameState
    const currentRoom = findById(gameState.currentRoomId, gameState.rooms)
    const currentStoryBoard = findById(currentStoryBoardId, gameProps.storyBoards ?? [])

    const [clickedTarget, setClickedTarget] = useState<ActorData | HotspotZone | undefined>(undefined)

    useEffect(() => {
        setClickedTarget(undefined)
    }, [gameState.currentRoomId, setClickedTarget])

    const handleTargetClick = (target: CommandTarget) => {
        if (target.type !== 'item') {
            setClickedTarget(target)
        }
    }

    const contentList = buildContentsList(
        gameState,
        handleTargetClick
    )

    const hoverTargetInRoom = getHoverTarget(gameState)
    const hoverPlaceProps = getTargetPlace(hoverTargetInRoom, gameState)

    const clickedTargetPlaceProps = getTargetPlace(clickedTarget, gameState)

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
            >
                {(hoverPlaceProps && hoverTargetInRoom) && (
                    <ParallaxPlace {...hoverPlaceProps}>
                        <TargetLabel target={hoverTargetInRoom} />
                    </ParallaxPlace>
                )}

                {(clickedTarget && clickedTargetPlaceProps) && (
                    <ParallaxPlace {...clickedTargetPlaceProps}>
                        <InteractionCoin target={clickedTarget} remove={() => setClickedTarget(undefined)} />
                    </ParallaxPlace>
                )}

            </Room>
        )}
    </>

}