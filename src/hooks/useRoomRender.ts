import { RoomRenderContext } from "@/context/room-render-context";
import { getXShift, getYShift } from "@/lib/roomFunctions";
import { useContext } from "react";

export const useRoomRender = () => {
    const { roomData, viewAngleX, viewAngleY } = useContext(RoomRenderContext);

    const surfaceXShift = getXShift(viewAngleX, 1, roomData);
    const surfaceYShift = getYShift(viewAngleY, 1, roomData);

    const plotSurfaceY = (y: number) => roomData.height - y + surfaceYShift;

    return {
        roomData, viewAngleX, viewAngleY,
        surfaceXShift, surfaceYShift,

        plotSurfaceY,
    }
};