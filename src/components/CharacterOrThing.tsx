import { sprites } from "../../data/sprites"
import { RoomData, ScaleLevel } from "../definitions/RoomData"
import { placeOnScreen } from "../lib/util";
import SpriteShape from "./SpriteShape";
import { useInterval } from "../lib/useInterval"
import { useLayoutEffect, useState } from "preact/hooks";
import { CharacterData } from "../definitions/CharacterData";
import { Order } from "../definitions/Order";
import { Sprite } from "../lib/Sprite";
import { DialogueBubble } from "./DialogueBubble";
import { ThingData } from "../definitions/ThingData";

interface Props {
    roomData: RoomData
    viewAngle: number
    data: CharacterData | ThingData
    animationRate?: number
    clickHandler?: { (character: CharacterData | ThingData): void }
    key: string | number
    orders?: Order[]
    isPaused: boolean
    roomScale?: number
}

const getAnimationName = (currentOrder: Order, status: string | undefined, sprite: Sprite): string => {
    const animationName = currentOrder ? currentOrder.steps[0]?.animation : status;
    const validAnimationName = (animationName && sprite.hasAnimation(animationName)) ? animationName : undefined;
    return validAnimationName || sprite.DEFAULT_ANIMATIONS[currentOrder?.type || 'wait'];
}

const getSpriteScale = (y: number, scaleLevel?: ScaleLevel): number => {

    if (!scaleLevel || scaleLevel.length == 0) { return 1 }

    let lowerLevel: [number, number];
    let upperLevel: [number, number];

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

export function CharacterOrThing({
    roomData, viewAngle,
    animationRate = 200, data, isPaused,
    clickHandler, orders = [], roomScale = 1
}: Props) {
    const {
        x, y,
        height = 50, width = 50, sprite, filter
    } = data
    const [currentOrder] = orders
    const text = currentOrder?.type === 'talk' ? currentOrder.steps[0].text : undefined;
    const spriteObject = sprites[sprite]
    const animationName = getAnimationName(currentOrder, data.status, spriteObject)
    const direction = data.direction || spriteObject.data.defaultDirection;
    const frames = spriteObject.getFrames(animationName, direction)

    const [frameIndex, setFrameIndex] = useState(0)
    const spriteScale = getSpriteScale(y, roomData.scaling)

    const updateFrame = () => {
        if (!frames || isPaused) { return }
        if (currentOrder?.type === 'act') {
            const [currentAction] = currentOrder.steps
            if (!currentAction) { return }
            const { timeElapsed = 0, duration, reverse } = currentAction
            const frame = reverse
                ? Math.floor(frames.length * ((duration - timeElapsed) / duration))
                : Math.floor(frames.length * (timeElapsed / duration))
            setFrameIndex(frame)
        } else {
            const nextFrameIndex = frameIndex + 1 < frames.length ? frameIndex + 1 : 0
            setFrameIndex(nextFrameIndex)
        }
    }

    // need to set frameIndex to zero when animation or direction changes
    // to avoid 'flash of missing frame' before next updateFrame
    useLayoutEffect(() => {
        setFrameIndex(0)
    }, [animationName, direction])


    useInterval(updateFrame, animationRate)

    const processClick = clickHandler
        ? (event: PointerEvent) => {
            event.stopPropagation()
            clickHandler(data)
        }
        : null

    const dialogueColor = data.type == 'character' ? data.dialogueColor : '';

    return (
        <>
            <SpriteShape
                clickHandler={processClick}
                roomData={roomData}
                viewAngle={viewAngle}
                x={x} y={y}
                height={height * spriteScale} width={width * spriteScale}
                sprite={sprite}
                frameIndex={frameIndex}
                animationName={animationName}
                direction={direction}
                filter={filter}
            />
            {text &&
                <DialogueBubble text={text}
                    x={placeOnScreen(x, viewAngle, roomData)}
                    y={roomData.height - y - (height * spriteScale)}
                    dialogueColor={dialogueColor}
                    roomData={roomData} roomScale={roomScale}/>
            }
        </>
    )
}