import { sprites } from "../../data/sprites"
import { RoomData } from "../definitions/RoomData"
import SpriteShape from "./SpriteShape";
import { useInterval } from "../lib/useInterval"
import { useLayoutEffect, useState } from "preact/hooks";
import { ThingData } from "../definitions/ThingData";

interface Props {
    roomData: RoomData
    viewAngle: number
    thingData: ThingData
    animationRate?: number
    clickHandler?: { (data: ThingData): void }
    key: string | number
    isPaused: boolean
}


export default function Thing({
    roomData, viewAngle,
    animationRate = 250, thingData,
    clickHandler = null,
    isPaused,
}: Props) {
    const {
        status,
        x, y,
        height = 50, width = 50, sprite, filter,
    } = thingData

    const spriteObject = sprites[sprite]
    const direction = thingData.direction || spriteObject.data.defaultDirection;

    const sequence = spriteObject.hasSequence(status) ? status : 'default'
    const frames = spriteObject.getFrames(sequence, direction)

    const [frameIndex, setFrameIndex] = useState(0)

    const updateFrame = () => {
        if (!frames || isPaused) { return }
        const nextFrameIndex = frameIndex + 1 < frames.length ? frameIndex + 1 : 0
        setFrameIndex(nextFrameIndex)
    }

    // need tp set frameIndex to zero when sequence or direction changes
    // to avoid 'flash of missing frame' before next updateFrame
    useLayoutEffect(() => {
        setFrameIndex(0)
    }, [sequence, direction])


    useInterval(updateFrame, animationRate)

    const processClick = clickHandler
        ? (event: PointerEvent) => {
            event.stopPropagation()
            clickHandler(thingData)
        }
        : null

    return (
        <>
            <SpriteShape
                clickHandler={processClick}
                roomData={roomData}
                viewAngle={viewAngle}
                x={x} y={y}
                height={height} width={width}
                sprite={sprite}
                sequence={sequence}
                frameIndex={frameIndex}
                direction={direction}
                filter={filter}
            />
        </>
    )
}