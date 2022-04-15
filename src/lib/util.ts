import { RoomData } from "./RoomData";

export function mapXvalue(
    pointX: number,
    parallax: number,
    observerX: number,
    roomData: RoomData
): number {
    const { width, frameWidth } = roomData
    return pointX - parallax ** 2 * (observerX * (frameWidth / width))
}
