import { RoomData } from "./RoomData";


function getPerspectiveAdjustment(
    parallax: number,
    observerX: number,
    roomData: RoomData
) {
    const { width, frameWidth } = roomData
    return parallax ** 2 * (observerX * (frameWidth / width))
}

export function mapXvalue(
    pointX: number,
    parallax: number,
    observerX: number,
    roomData: RoomData
): number {
    return pointX - getPerspectiveAdjustment(parallax, observerX, roomData)
}

export function unMapXvalue(
    mappedX: number,
    parallax: number,
    observerX: number,
    roomData: RoomData
): number {
    return mappedX + getPerspectiveAdjustment(parallax, observerX, roomData)
}

export function parallaxPosition(x, parallax, roomData: RoomData) {
    return x * ((roomData.frameWidth * parallax ** 2 + roomData.width * (1 - parallax ** 2)) / roomData.frameWidth)
}