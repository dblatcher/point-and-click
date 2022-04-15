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


export function getLayerWidth(parallax: number, roomData: RoomData) {
    const { frameWidth, width } = roomData
    return frameWidth + (parallax * (width - frameWidth))
}

export function getShift(viewAngle: number, parallax: number, roomData: RoomData) {
    const layerWidth = getLayerWidth(parallax, roomData)
    const shiftRange = (layerWidth - roomData.frameWidth) / 2
    return viewAngle * shiftRange
}