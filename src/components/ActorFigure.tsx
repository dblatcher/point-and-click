import { h, Fragment, FunctionalComponent, JSX } from "preact";
import { useLayoutEffect, useState } from "preact/hooks";
import { RoomData, Order, ActorData } from "src"
import { placeOnScreen } from "../lib/roomFunctions";
import { getScale } from "../lib/getScale";
import { Sprite } from "../lib/Sprite";
import { useInterval } from "../lib/useInterval"

import { SpriteShape } from "./SpriteShape";
import { DialogueBubble } from "./DialogueBubble";
import spriteService from "../services/spriteService";
import { HandleClickFunction, HandleHoverFunction } from "./Game";
import { PersistentSound } from "./PersistentSound";
import { SoundEffectMap, SoundValue } from "src/definitions/ActorData";
import { IntermitentSound } from "./IntermitentSound";

interface Props {
    roomData: RoomData;
    viewAngle: number;
    data: ActorData;
    animationRate?: number;
    clickHandler?: HandleClickFunction<ActorData>;
    handleHover?: HandleHoverFunction;
    orders?: Order[];
    isPaused: boolean;
    roomScale?: number;
    overrideSprite?: Sprite;
    forPreview?: boolean;
}

const getAnimationName = (currentOrder: Order, status: string | undefined, sprite?: Sprite): string => {
    if (!sprite) { return 'wait' }
    const animationName = currentOrder ? currentOrder.steps[0]?.animation : status;
    const validAnimationName = (animationName && sprite.hasAnimation(animationName)) ? animationName : undefined;
    return validAnimationName || sprite.DEFAULT_ANIMATIONS[currentOrder?.type || 'wait'];
}

const getSoundValue = (
    currentOrder: Order | undefined,
    status: string | undefined,
    soundMap: SoundEffectMap
): SoundValue | undefined => {
    if (currentOrder) {
        const [currentAction] = currentOrder.steps
        if (currentAction?.animation) {
            return soundMap[currentAction.animation]
        }
    } else if (status) {
        return soundMap[status]
    }
    return undefined
}


export const ActorFigure: FunctionalComponent<Props> = ({
    data,
    roomData,
    viewAngle,
    animationRate = 200,
    isPaused,
    clickHandler, handleHover,
    orders = [],
    roomScale = 1,
    overrideSprite,
    forPreview
}: Props) => {
    const [frameIndex, setFrameIndex] = useState<number>(0)

    const {
        x, y,
        height = 50, width = 50, sprite: spriteId, filter, dialogueColor = '',
        status, soundEffectMap = {}
    } = data
    const spriteObject = overrideSprite || spriteService.get(spriteId)
    const currentOrder: Order | undefined = orders[0]
    const text = currentOrder?.type === 'talk' ? currentOrder.steps[0]?.text : undefined;
    const animationName = getAnimationName(currentOrder, data.status, spriteObject)
    const direction = data.direction || spriteObject?.data.defaultDirection || 'left';
    const frames = spriteObject?.getFrames(animationName, direction) || []
    const spriteScale = getScale(y, roomData.scaling)

    const soundValue = getSoundValue(currentOrder, status, soundEffectMap)

    const updateFrame = (): void => {
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

    const processClick: JSX.MouseEventHandler<SVGElement> | undefined = clickHandler
        ? (event): void => {
            event.stopPropagation()
            clickHandler(data)
        }
        : undefined

    // need to set frameIndex to zero when animation or direction changes
    // to avoid 'flash of missing frame' before next updateFrame
    useLayoutEffect(() => {
        setFrameIndex(0)
    }, [animationName, direction])

    useInterval(updateFrame, animationRate)

    if (!spriteObject) {
        return null
    }
    return (
        <>
            <SpriteShape
                spriteObject={spriteObject}
                animationName={animationName}
                direction={direction}
                frameIndex={frameIndex}
                clickHandler={processClick}
                handleHover={processClick ? handleHover : undefined}
                hoverData={data}
                roomData={roomData}
                viewAngle={viewAngle}
                x={x} y={y}
                height={height * spriteScale} width={width * spriteScale}
                filter={filter}
                status={data.status}
            />
            {text &&
                <DialogueBubble text={text}
                    x={placeOnScreen(x, viewAngle, roomData)}
                    y={y + (height * spriteScale)}
                    dialogueColor={dialogueColor}
                    roomData={roomData} roomScale={roomScale} />
            }
            {(!forPreview && typeof soundValue?.frameIndex === 'undefined') &&
                <PersistentSound
                    soundValue={soundValue}
                    animationRate={animationRate}
                    isPaused={isPaused} />
            }
            {(!forPreview && typeof soundValue?.frameIndex === 'number') &&
                <IntermitentSound
                    soundValue={soundValue}
                    frameIndex={frameIndex}
                    isPaused={isPaused} />
            }
        </>
    )
}