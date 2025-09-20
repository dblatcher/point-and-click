import { RoomData } from "@/definitions";
import { createContext } from "react";

export const RoomRenderContext = createContext<{
    roomData: RoomData,
    viewAngleX: number,
    viewAngleY: number,
    scale: number,
}>({
    roomData: {
        id: "",
        frameWidth: 0,
        width: 0,
        height: 0,
        background: []
    },
    viewAngleX: 0,
    viewAngleY: 0,
    scale: 1,
})


