import { sprites } from "../../data/sprites"
import { RoomData } from "../definitions/RoomData"
import SpriteShape from "./SpriteShape";
import { useInterval } from "../lib/useInterval"
import { useLayoutEffect, useState } from "preact/hooks";
import { ThingData } from "../definitions/ThingData";
import { ThingOrder } from "../definitions/Order";
import { Sprite } from "../lib/Sprite";

interface Props {
    roomData: RoomData
    viewAngle: number
    thingData: ThingData
    orders?: ThingOrder[]
    animationRate?: number
    clickHandler?: { (data: ThingData): void }
    key: string | number
    isPaused: boolean
}

const getAnimationName = (currentOrder: ThingOrder, status: string | undefined, sprite: Sprite): string => {
    const animationName = currentOrder ? currentOrder.steps[0]?.animation : status;
    const validAnimationName = (animationName && sprite.hasAnimation(animationName)) ? animationName : undefined;
    return validAnimationName || sprite.DEFAULT_ANIMATIONS[currentOrder?.type || 'wait'];
}

export default function Thing({
    roomData, viewAngle,
    animationRate = 250, thingData, orders = [],
    clickHandler = null,
    isPaused,
}: Props) {
    const {
        x, y,
        height = 50, width = 50, sprite, filter,
    } = thingData
    const [currentOrder] = orders
    const spriteObject = sprites[sprite]
    const animationName = getAnimationName(currentOrder, thingData.status, spriteObject)

    const direction = thingData.direction || spriteObject.data.defaultDirection;


    const frames = spriteObject.getFrames(animationName, direction)

    const [frameIndex, setFrameIndex] = useState(0)

    const updateFrame = () => {
        if (!frames || isPaused) { return }
        if (currentOrder?.type === 'act') {
            const [currentAction] = currentOrder.steps
            if (!currentAction) { return }
            const { timeElapsed = 0, duration } = currentAction
            const frame = Math.floor(frames.length * (timeElapsed / duration))
            setFrameIndex(frame)
        } else {
            const nextFrameIndex = frameIndex + 1 < frames.length ? frameIndex + 1 : 0
            setFrameIndex(nextFrameIndex)
        }
    }

    // need tp set frameIndex to zero when animation or direction changes
    // to avoid 'flash of missing frame' before next updateFrame
    useLayoutEffect(() => {
        setFrameIndex(0)
    }, [animationName, direction])


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
                animationName={animationName}
                frameIndex={frameIndex}
                direction={direction}
                filter={filter}
            />
        </>
    )
}