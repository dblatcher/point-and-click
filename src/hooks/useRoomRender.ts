import { RoomRenderContext } from "@/context/room-render-context";
import { getXShift, getYShift } from "@/lib/roomFunctions";
import { useContext } from "react";

export const useRoomRender = () => {
    const { roomData, viewAngleX, viewAngleY, scale } = useContext(RoomRenderContext);
    const { width, frameWidth, height, frameHeight = height } = roomData;

    const surfaceXShift = getXShift(viewAngleX, 1, roomData);
    const surfaceYShift = getYShift(viewAngleY, 1, roomData);

    const surfaceXOffcenter = (frameWidth / 2) - (width / 2) + surfaceXShift
    const surfaceYOffcenter = (frameHeight / 2) - (height / 2) + surfaceYShift

    const plotSurfaceY = (y: number) => height - y + surfaceYShift;

    return {
        roomData, viewAngleX, viewAngleY,
        surfaceXShift, surfaceYShift,
        surfaceXOffcenter, surfaceYOffcenter,
        scale,
        plotSurfaceY,
    }
};