import { h, Fragment, FunctionalComponent, JSX } from "preact";
import { useLayoutEffect, useState } from "preact/hooks";
import { RoomData,Order,ActorData } from "src"
import { placeOnScreen } from "../lib/util";
import { getScale } from "../lib/getScale";
import { Sprite } from "../lib/Sprite";
import { useInterval } from "../lib/useInterval"

import { SpriteShape } from "./SpriteShape";
import { DialogueBubble } from "./DialogueBubble";
import spriteService from "../services/spriteService";
import { HandleClickFunction, HandleHoverFunction } from "./Game";

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
}

const getAnimationName = (currentOrder: Order, status: string | undefined, sprite?: Sprite): string => {
    if (!sprite) { return 'wait' }
    const animationName = currentOrder ? currentOrder.steps[0]?.animation : status;
    const validAnimationName = (animationName && sprite.hasAnimation(animationName)) ? animationName : undefined;
    return validAnimationName || sprite.DEFAULT_ANIMATIONS[currentOrder?.type || 'wait'];
}

export const ActorFigure: FunctionalComponent<Props> = ({
    data, 
    roomData, 
    viewAngle,
    animationRate = 200, 
    isPaused,
    clickHandler, handleHover,
    orders = [], roomScale = 1, overrideSprite
}: Props) => {
    const [frameIndex, setFrameIndex] = useState<number>(0)
    const {
        x, y,
        height = 50, width = 50, sprite: spriteId, filter, dialogueColor=''
    } = data
    const spriteObject = overrideSprite || spriteService.get(spriteId)
    const [currentOrder] = orders
    const text = currentOrder?.type === 'talk' ? currentOrder.steps[0]?.text : undefined;
    const animationName = getAnimationName(currentOrder, data.status, spriteObject)
    const direction = data.direction || spriteObject?.data.defaultDirection || 'left';
    const frames = spriteObject?.getFrames(animationName, direction) || []
    const spriteScale = getScale(y, roomData.scaling)

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

    // need to set frameIndex to zero when animation or direction changes
    // to avoid 'flash of missing frame' before next updateFrame
    useLayoutEffect(() => {
        setFrameIndex(0)
    }, [animationName, direction])


    useInterval(updateFrame, animationRate)

    const processClick: JSX.MouseEventHandler<SVGElement> | undefined = clickHandler
        ? (event): void => {
            event.stopPropagation()
            clickHandler(data)
        }
        : undefined

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
                    y={roomData.height - y - (height * spriteScale)}
                    dialogueColor={dialogueColor}
                    roomData={roomData} roomScale={roomScale} />
            }
        </>
    )
}