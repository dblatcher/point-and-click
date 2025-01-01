import { useGameState } from "@/context/game-state-context";
import { ActorData, CommandTarget, HotspotZone, Verb } from "@/definitions";
import { GameState } from "@/lib/game-state-logic/types";
import { calculateScreenX } from "@/lib/roomFunctions";
import { clamp, findById } from "@/lib/util";
import React, { useEffect, useRef, useState } from "react";
import { buildContentsList } from "../game/put-contents-in-order";
import { ParallaxPlace, ParallaxPlaceProps } from "../svg/ParallaxPlace";
import { Room } from "../svg/Room";
import { InteractionCoin } from "./InteractionCoin";
import { TargetLabel } from "./TargetLabel";
import { ResizeWatcher } from "../ResizeWatcher";
import { screenSizeAction } from "@/lib/game-state-logic/game-state-reducer";


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

    const adjustedY = clamp(hoverTargetInRoom.y, currentRoom.height - 15, 15)

    if (hoverTargetInRoom.type === 'hotspot') {
        const labelProps: ParallaxPlaceProps = {
            x: hoverTargetInRoom.x,
            y: adjustedY,
            parallax: hoverTargetInRoom.parallax,
            roomData: currentRoom,
            viewAngle: gameState.viewAngle,
        }
        return labelProps
    }

    const labelProps: ParallaxPlaceProps = {
        x: calculateScreenX(hoverTargetInRoom.x - (hoverTargetInRoom.width / 2), gameState.viewAngle, currentRoom),
        y: adjustedY,
        parallax: 0,
        roomData: currentRoom,
        viewAngle: gameState.viewAngle,
    }
    return labelProps
}


// use true for debugging only- slows program!
const renderCells = false

export const RoomWrapperWithOverlay: React.FunctionComponent = () => {
    const [clickedTarget, setClickedTarget] = useState<ActorData | HotspotZone | undefined>(undefined)
    const [clickEvent, setClickEvent] = useState<PointerEvent>();
    const { gameProps, gameState, updateGameState } = useGameState()
    const { viewAngle, isPaused, roomHeight, roomWidth, currentStoryBoardId } = gameState
    const currentRoom = findById(gameState.currentRoomId, gameState.rooms)
    const currentStoryBoard = findById(currentStoryBoardId, gameProps.storyBoards ?? [])


    useEffect(() => {
        setClickedTarget(undefined)
    }, [gameState.currentRoomId, setClickedTarget])

    const handleTargetClick = (target: CommandTarget, event: PointerEvent) => {
        if (target.type !== 'item') {
            setClickedTarget(target)
            setClickEvent(event)
        }
    }

    const performDefaultInteraction = (target: CommandTarget) => {
        const lookVerb = gameProps.verbs.find(verb => verb.isLookVerb)
        if (lookVerb) {
            updateGameState({
                type: 'SEND-COMMAND', command: {
                    target,
                    verb: lookVerb
                }
            })
        }
    }

    const containerRef = useRef<HTMLDivElement>(null)
    const contentList = buildContentsList(
        gameState,
        handleTargetClick,
        performDefaultInteraction,
    )

    const hoverTargetInRoom = getHoverTarget(gameState)
    const hoverPlaceProps = getTargetPlace(hoverTargetInRoom, gameState)

    return (
        <ResizeWatcher resizeHandler={() => {
            const innnerLayout = document.querySelector('.LAYOUT_INNER');
            if (innnerLayout) {
                updateGameState(screenSizeAction(innnerLayout.clientWidth - 20, innnerLayout.clientHeight - 40))
            }
        }}>
            {(currentRoom && !currentStoryBoard) && (
                <div
                    style={{ position: 'relative' }}
                    ref={containerRef}
                >
                    <Room
                        data={currentRoom}
                        maxWidth={roomWidth}
                        maxHeight={roomHeight}
                        isPaused={isPaused}
                        viewAngle={viewAngle}
                        handleRoomClick={(x, y) => {
                            updateGameState({ type: 'ROOM-CLICK', x, y })
                            setClickedTarget(undefined)
                        }}
                        handleHotspotClick={handleTargetClick}
                        handleHotspotContextClick={performDefaultInteraction}
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
                    </Room>

                    {clickedTarget && (
                        <div style={{
                            position: 'absolute',
                            top: (clickEvent?.pageY ?? 0) - (containerRef.current?.offsetTop ?? 0),
                            left: (clickEvent?.pageX ?? 0) - (containerRef.current?.offsetLeft ?? 0),
                            transform: "translateX(-50%) translateY(-100%)"
                        }}>
                            <InteractionCoin target={clickedTarget} remove={() => setClickedTarget(undefined)} />
                        </div>
                    )}
                </div>
            )}
        </ResizeWatcher>
    )

}