import { useAssets } from "@/context/asset-context";
import { useGameState, useGameStateDerivations } from "@/context/game-state-context";
import { screenSizeAction } from "@/lib/game-state-logic/game-state-actions";
import { GameState } from "@/lib/game-state-logic/types";
import { clamp, findById } from "@/lib/util";
import InventoryIcon from '@mui/icons-material/Inventory2Outlined';
import { Box, Button } from "@mui/material";
import { ActorData, CommandTarget, HotspotZone, matchInteraction, RoomData } from "point-click-lib";
import React, { useEffect, useRef, useState } from "react";
import { buildActorListSortedForDisplay } from "../../game/put-contents-in-order";
import { ResizeWatcher } from "../../ResizeWatcher";
import { SoundHandler } from "../../sound/SoundHandler";
import { ParallaxPlace, ParallaxPlaceProps } from "../../svg/ParallaxPlace";
import { getXShift, Room } from "point-click-components";
import { InteractionCoin } from "./InteractionCoin";
import { InventoryDrawer } from "./InventoryDrawer";
import { TargetLabel } from "./TargetLabel";

const getHoverTarget = (gameState: GameState): ActorData | HotspotZone | undefined => {
    return gameState.hoverTarget?.type === 'actor' || gameState.hoverTarget?.type === 'hotspot'
        ? gameState.hoverTarget
        : undefined
}

function calculateScreenX(xPosition: number, viewAngleX: number, roomData: RoomData) {
    const { width, frameWidth } = roomData
    const shift = getXShift(viewAngleX, 1, roomData)
    return (frameWidth / 2) + (xPosition - width / 2) + shift
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
        }
        return labelProps
    }

    const labelProps: ParallaxPlaceProps = {
        x: calculateScreenX(hoverTargetInRoom.x - (hoverTargetInRoom.width / 2), gameState.viewAngleX, currentRoom),
        y: adjustedY,
        parallax: 0,
    }
    return labelProps
}


// use true for debugging only- slows program!
const renderCells = false

export const RoomWrapperWithOverlay: React.FunctionComponent = () => {
    const [clickedTarget, setClickedTarget] = useState<ActorData | HotspotZone | undefined>(undefined)
    const [clickEvent, setClickEvent] = useState<PointerEvent>();
    const [inventoryOpen, setInventoryOpen] = useState(false);
    const { gameProps, gameState, updateGameState } = useGameState()
    const { getImageAsset } = useAssets();
    const { isConversationRunning, isSequenceRunning, inventory, lookVerb, moveVerb, currentStoryBoard } = useGameStateDerivations()
    const { viewAngleX, viewAngleY, isPaused, roomHeight, roomWidth } = gameState
    const currentRoom = findById(gameState.currentRoomId, gameState.rooms)


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
        if (moveVerb) {
            const moveCommand = { verb: moveVerb, target };
            const moveInteraction = matchInteraction(moveCommand, currentRoom, gameProps.interactions, gameState)
            if (moveInteraction) {
                return updateGameState({
                    type: 'SEND-COMMAND', command: moveCommand
                })
            }
        }

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
    const orderedActors = buildActorListSortedForDisplay(
        gameState,
        handleTargetClick,
        performDefaultInteraction,
    )

    const hoverTargetInRoom = getHoverTarget(gameState)
    const hoverPlaceProps = getTargetPlace(hoverTargetInRoom, gameState)

    const showInventory = inventoryOpen && !isSequenceRunning && !isConversationRunning;

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
                        viewAngleX={viewAngleX}
                        viewAngleY={viewAngleY}
                        handleRoomClick={(x, y) => {
                            updateGameState({ type: 'ROOM-CLICK', x, y })
                            setClickedTarget(undefined)
                        }}
                        handleRoomContextClick={() => {
                            if (inventory.length === 0) {
                                return
                            }
                            setClickedTarget(undefined)
                            setInventoryOpen(true)
                        }}
                        handleHotspotClick={handleTargetClick}
                        handleHotspotContextClick={performDefaultInteraction}
                        handleHover={(target: CommandTarget, event: 'enter' | 'leave') => {
                            updateGameState({ type: 'HANDLE-HOVER', event, target })
                        }}
                        orderedActors={orderedActors}
                        obstacleCells={renderCells ? gameState.cellMatrix : undefined}
                        parallaxContent={
                            (hoverPlaceProps && hoverTargetInRoom) && (
                                <ParallaxPlace {...hoverPlaceProps}>
                                    <TargetLabel target={hoverTargetInRoom} />
                                </ParallaxPlace>
                            )
                        }
                        getImageAsset={getImageAsset}
                        orderSpeed={gameProps.orderSpeed}
                        sprites={gameProps.sprites}
                        SoundHandler={SoundHandler}
                    />

                    {(!isSequenceRunning && !isConversationRunning) && (
                        <>
                            <InteractionCoin
                                isShowing={!!clickedTarget}
                                target={clickedTarget}
                                remove={() => setClickedTarget(undefined)}
                                x={(clickEvent?.pageY ?? 0) - (containerRef.current?.offsetTop ?? 0)}
                                y={(clickEvent?.pageX ?? 0) - (containerRef.current?.offsetLeft ?? 0)}
                            />

                            <Box paddingX={2} sx={{
                                position: 'absolute',
                                bottom: 0,
                            }}>
                                <Button variant="contained"
                                    startIcon={<InventoryIcon />}
                                    disabled={inventory.length === 0}
                                    onClick={() => {
                                        setClickedTarget(undefined)
                                        setInventoryOpen(true)
                                    }}>INV</Button>
                            </Box>
                        </>
                    )}

                    <InventoryDrawer
                        isShowing={showInventory}
                        remove={() => setInventoryOpen(false)} />
                </div>
            )}
        </ResizeWatcher>
    )

}