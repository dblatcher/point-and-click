import { FunctionComponent, useLayoutEffect, useState } from "react";

import { ActorData, Order, RoomData } from "@/definitions";
import { getScale } from "@/lib/getScale";
import { Sprite } from "@/lib/Sprite";
import { useInterval } from "@/lib/useInterval";
import { MouseEventHandler } from "react";

import { IntermitentSound } from "@/components/sound/IntermitentSound";
import { PersistentSound } from "@/components/sound/PersistentSound";
import { useSprites } from "@/context/sprite-context";
import { findById } from "@/lib/util";
import { SoundEffectMap, SoundValue } from "../../definitions/ActorData";
import { HandleClickFunction, HandleHoverFunction } from "../game";
import { FrameShape } from "./FrameShape";
import { SpriteShape } from "./SpriteShape";

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
    noSound?: boolean;
}

const getUnverifiedAnimationName = (currentOrder: Order | undefined, status: string | undefined): string | undefined => {
    const specificAnimationFromOrder = currentOrder
        ? ('steps' in currentOrder)
            ? currentOrder.steps[0]?.animation
            : currentOrder.animation
        : undefined;
    const defaultAnimationFromOrder = currentOrder
        ? Sprite.DEFAULT_ANIMATION[currentOrder.type]
        : undefined
    return specificAnimationFromOrder || defaultAnimationFromOrder || status || 'default';
}

const getAnimationName = (currentOrder: Order | undefined, status: string | undefined, sprite?: Sprite): string => {
    if (!sprite) { return Sprite.DEFAULT_ANIMATION.wait }
    const animationName = getUnverifiedAnimationName(currentOrder, status)
    return animationName && sprite.hasAnimation(animationName)
        ? animationName
        : Sprite.DEFAULT_ANIMATION[currentOrder?.type || 'wait'];
}

const getSoundValues = (
    currentOrder: Order | undefined,
    status: string | undefined,
    soundMap: SoundEffectMap
): SoundValue[] => {
    const animationName = getUnverifiedAnimationName(currentOrder, status)
    const valueOrValueArray = animationName ? soundMap[animationName] : undefined
    if (!valueOrValueArray) { return [] }
    return Array.isArray(valueOrValueArray) ? valueOrValueArray : [valueOrValueArray]
}


export const ActorFigure: FunctionComponent<Props> = ({
    data,
    roomData,
    viewAngle,
    animationRate = 200,
    isPaused,
    clickHandler, handleHover,
    orders = [],
    overrideSprite,
    noSound,
}: Props) => {
    const [frameIndex, setFrameIndex] = useState<number>(0)
    const sprites = useSprites()

    const {
        x, y,
        height = 50, width = 50, sprite: spriteId, filter,
        status, soundEffectMap = {}
    } = data
    const spriteObject = overrideSprite || findById(spriteId, sprites)
    const currentOrder: Order | undefined = orders[0]
    const animationName = getAnimationName(currentOrder, data.status, spriteObject)

    const soundValues = getSoundValues(currentOrder, status, soundEffectMap)
    const persistentSoundValues = soundValues.filter(sv => typeof sv.frameIndex === 'undefined')
    const intermittentSoundValues = soundValues.filter(sv => typeof sv.frameIndex === 'number')

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

    const processClick = clickHandler
        ? (event: Event): void => {
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

    if (spriteObject) {
        return (
            <>
                <SpriteShape
                    spriteObject={spriteObject}
                    animationName={animationName}
                    direction={direction}
                    frameIndex={frameIndex}
                    // works - the Event definitions don't match, but stopPropagation is the only event method needed
                    clickHandler={processClick as unknown as MouseEventHandler<SVGElement>}
                    handleHover={processClick ? handleHover : undefined}
                    hoverData={data}
                    roomData={roomData}
                    viewAngle={viewAngle}
                    x={x} y={y}
                    height={height * spriteScale} width={width * spriteScale}
                    filter={filter}
                    status={data.status}
                />

                {!noSound && <>
                    {persistentSoundValues.map((soundValue, index) =>
                        <PersistentSound
                            key={index}
                            soundValue={soundValue}
                            animationRate={animationRate}
                            isPaused={isPaused} />)}
                    {intermittentSoundValues.map((soundValue, index) => (
                        <IntermitentSound
                            key={index}
                            frameIndex={frameIndex}
                            soundValue={soundValue}
                            isPaused={isPaused} />
                    ))}
                </>}
            </>
        )
    }


    return (
        <FrameShape
            // works - the Event definitions don't match, but stopPropagation is the only event method needed
            clickHandler={processClick as unknown as MouseEventHandler<SVGElement>}
            handleHover={processClick ? handleHover : undefined}
            actorData={data}
            roomData={roomData}
            viewAngle={viewAngle}
            x={x} y={y}
            height={height * spriteScale} width={width * spriteScale}
            filter={filter}
            status={data.status}
        />
    )

}

