import { useCameraPoint } from "@/context/camera-point-context";
import { RoomRenderContext } from "@/context/room-render-context";
import { getXShift, getYShift } from "@/lib/roomFunctions";
import { useContext } from "react";

export const useRoomRender = () => {
    const { cameraPoint } = useCameraPoint()
    const { roomData, scale, viewAngleX, viewAngleY } = useContext(RoomRenderContext);
    const { width, frameWidth, height, frameHeight = height } = roomData;
    const viewPoint = cameraPoint ?? { x: viewAngleX, y: viewAngleY };

    const surfaceXShift = getXShift(viewPoint.x, 1, roomData);
    const surfaceYShift = getYShift(viewPoint.y, 1, roomData);
    const surfaceXOffcenter = (frameWidth / 2) - (width / 2) + surfaceXShift
    const surfaceYOffcenter = (frameHeight / 2) - (height / 2) + surfaceYShift
    const plotSurfaceY = (y: number) => height - y + surfaceYShift;

    return {
        roomData,
        viewAngleX: viewPoint.x,
        viewAngleY: viewPoint.y,
        surfaceXShift,
        surfaceYShift,
        surfaceXOffcenter,
        surfaceYOffcenter,
        scale,
        plotSurfaceY,
    }
};