import { useGameState } from "@/context/game-state-context";
import { useState } from "react";


export const useCamera = (maxCameraMove = 0.005) => {
    const { gameState } = useGameState()
    const [roomId, setRoomId] = useState(gameState.currentRoomId)
    const [cameraX, setCameraX] = useState(gameState.viewAngleX)
    const [cameraY, setCameraY] = useState(gameState.viewAngleY)
    const [isAtPoint, setIsAtPoint] = useState(true)

    const updateCamera = (viewAngleX: number, viewAngleY: number, currentRoomId: string) => {
        if (roomId !== currentRoomId) {
            console.log({ roomId, cameraX, cameraY }, { currentRoomId, viewAngleX, viewAngleY })
            setRoomId(currentRoomId)
            setCameraX(viewAngleX)
            setCameraY(viewAngleY)
            setIsAtPoint(true)
            return
        }
        const newCameraX = Math.abs(viewAngleX - cameraX) <= maxCameraMove
            ? viewAngleX
            : cameraX + maxCameraMove * Math.sign(viewAngleX - cameraX);
        const newCameraY = Math.abs(viewAngleY - cameraY) <= maxCameraMove
            ? viewAngleY
            : cameraY + maxCameraMove * Math.sign(viewAngleY - cameraY);
        setCameraX(newCameraX)
        setCameraY(newCameraY)
        setIsAtPoint(newCameraX === viewAngleX && newCameraY === viewAngleY)
    }

    return {
        cameraPoint: { x: cameraX, y: cameraY },
        updateCamera,
        isAtPoint
    }
};