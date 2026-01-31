import { useGameState } from "@/context/game-state-context";
import { RoomRenderContext } from "@/context/room-render-context";
import { useContext, useState } from "react";
import { useInterval } from "./useInterval";

const MAX_CAMERA_MOVE = 0.005;

// TO DO - the hook is convienient, but the stae is duplicated for every
// usage in useRoomRender.
// can we instead hold the camera state in context? 
export const useCamera = () => {
    const { gameProps: { timerInterval = 10 }, gameState: { isPaused } } = useGameState()
    const { roomData, viewAngleX, viewAngleY } = useContext(RoomRenderContext);

    const [roomId, setRoomId] = useState(roomData.id)
    const [cameraX, setCameraX] = useState(viewAngleX)
    const [cameraY, setCameraY] = useState(viewAngleY)

    useInterval(() => {
        if (isPaused) {
            return
        }
        if (roomId !== roomData.id) {
            setRoomId(roomData.id)
            setCameraX(viewAngleX)
            setCameraY(viewAngleY)
            return
        }
        const newCameraX = Math.abs(viewAngleX - cameraX) <= MAX_CAMERA_MOVE
            ? viewAngleX
            : cameraX + MAX_CAMERA_MOVE * Math.sign(viewAngleX - cameraX);
        const newCameraY = Math.abs(viewAngleY - cameraY) <= MAX_CAMERA_MOVE
            ? viewAngleY
            : cameraY + MAX_CAMERA_MOVE * Math.sign(viewAngleY - cameraY);
        setCameraX(newCameraX)
        setCameraY(newCameraY)
    }, timerInterval)

    return {
        x: cameraX,
        y: cameraY,
    }
};