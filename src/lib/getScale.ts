import { ScaleLevel } from "point-click-lib";

export const getScale = (y: number, scaleLevel?: ScaleLevel): number => {

    if (!scaleLevel || scaleLevel.length == 0) { return 1 }

    let lowerLevel: [number, number] | undefined = undefined;
    let upperLevel: [number, number] | undefined = undefined;

    let i;
    for (i = 0; i < scaleLevel.length; i++) {
        let current = scaleLevel[i]
        let next = scaleLevel[i + 1]

        if (y < current[0]) { continue }
        lowerLevel = current;
        upperLevel = next;
        break;
    }

    if (!lowerLevel) {
        return 1
    }

    if (!upperLevel) {
        return lowerLevel[1]
    }


    const [lowY, lowScale] = lowerLevel
    const [uppY, uppScale] = upperLevel

    const normalisedDistance = (y - lowY) / (uppY - lowY)

    const scale = lowScale + (uppScale - lowScale) * normalisedDistance

    return scale
}