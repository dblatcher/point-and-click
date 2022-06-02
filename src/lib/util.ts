/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { RoomData } from "../definitions/RoomData";
export function clamp(value: number, max = 1, min = 0) {
    return Math.max(Math.min(value, max), min)
}

export function eventToNumber(event: Event, defaultValue = 0): number {
    if (!event.target) { return defaultValue }
    const numericalValue = Number((event.target as HTMLInputElement).value);
    return isNaN(numericalValue) ? defaultValue : numericalValue;
}

export function eventToBoolean(event: Event, defaultValue = false): boolean {
    if (!event.target) { return defaultValue }
    return (event.target as HTMLInputElement).checked;
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

export function placeOnScreen(xPosition: number, viewAngle: number, roomData: RoomData) {
    const { width, frameWidth } = roomData
    const offCenter = 2 * (xPosition - width / 2) / width
    const shift = getShift(viewAngle, 1, roomData)
    const result = (frameWidth / 2) + (offCenter * (width / 2)) + shift
    return result
}


export function locateClickInWorld(clickXPosition: number, clickYposition: number, viewAngle: number, roomData: RoomData) {
    const { width, frameWidth, height } = roomData
    const shift = getShift(viewAngle, 1, roomData)
    const offCenterInPoints = (clickXPosition - frameWidth / 2)
    const centerOfScreenXPosition = (width / 2) - shift
    const x = offCenterInPoints + centerOfScreenXPosition
    const y = height - clickYposition
    return { x, y }
}

export function getViewAngleCenteredOn(xPosition: number, roomData: RoomData) {
    const { width } = roomData
    const offCenter = 2 * (xPosition - width / 2) / width
    return -offCenter * 2
}
