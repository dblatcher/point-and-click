import { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react";
import { IntermitentSound } from "@/components/sound/IntermitentSound";
import { PersistentSound } from "@/components/sound/PersistentSound";
import { useGameState } from "@/context/game-state-context";
import { useInterval } from "@/hooks/useInterval";
import { useRoomRender } from "@/hooks/useRoomRender";
import { getScale } from "@/lib/getScale";
import { Sprite } from "@/lib/Sprite";
import { findById } from "@/lib/util";
import { ImageAsset } from "@/services/assets";
import { ActorData, DEFAULT_ANIMATION, Order, SoundEffectMap, SoundValue, SpriteData } from "point-click-lib";
import { MouseEventHandler } from "react";
import { HandleClickFunction, HandleHoverFunction } from "../game/types";
import { FrameShape } from "./FrameShape";
import { SpriteShape } from "./SpriteShape";

interface Props {
    data: ActorData;
    clickHandler?: HandleClickFunction<ActorData>;
    contextClickHandler?: HandleClickFunction<ActorData>;
    handleHover?: HandleHoverFunction;
    orders?: Order[];
    isPaused: boolean;
    roomScale?: number;
    overrideSpriteData?: SpriteData;
    noSound?: boolean;
    getImageAsset: { (id: string): ImageAsset | undefined }
}

const getUnverifiedAnimationName = (currentOrder: Order | undefined, status: string | undefined): string | undefined => {
    const specificAnimationFromOrder = currentOrder
        ? ('steps' in currentOrder)
            ? currentOrder.steps[0]?.animation
            : currentOrder.animation
        : undefined;
    const defaultAnimationFromOrder = currentOrder
        ? DEFAULT_ANIMATION[currentOrder.type]
        : undefined
    return specificAnimationFromOrder || defaultAnimationFromOrder || status || 'default';
}

const getAnimationName = (currentOrder: Order | undefined, status: string | undefined, sprite?: Sprite): string => {
    if (!sprite) { return DEFAULT_ANIMATION.wait }
    const animationName = getUnverifiedAnimationName(currentOrder, status)
    return animationName && sprite.hasAnimation(animationName)
        ? animationName
        : DEFAULT_ANIMATION[currentOrder?.type || 'wait'];
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
    isPaused,
    clickHandler, handleHover, contextClickHandler,
    orders = [],
    overrideSpriteData,
    noSound,
    getImageAsset,
}: Props) => {
    const { roomData, orderSpeed } = useRoomRender()
    const { gameProps } = useGameState()
    const animationRate = 200 / (orderSpeed)

    const {
        x, y,
        height = 50, width = 50, filter,
        status,
        soundEffectMap = {},
        sprite: spriteId
    } = data

    const sprite = useMemo(
        () => {
            const spriteData = overrideSpriteData ?? findById(spriteId, gameProps.sprites);
            return spriteData && new Sprite(spriteData, getImageAsset);
        },
        [overrideSpriteData, spriteId]
    );

    const currentOrder: Order | undefined = orders[0]
    const currentAnimation = getAnimationName(currentOrder, status, sprite)

    const [animationName, setAnimationName] = useState(currentAnimation)
    const [frameIndex, setFrameIndex] = useState<number>(0)
    const [reverseCycle, setReverseCycle] = useState(false)

    const soundValues = getSoundValues(currentOrder, status, soundEffectMap)
    const persistentSoundValues = soundValues.filter(sv => typeof sv.frameIndex === 'undefined')
    const intermittentSoundValues = soundValues.filter(sv => typeof sv.frameIndex === 'number')

    const direction = data.direction || sprite?.data.defaultDirection || 'left';
    const spriteScale = getScale(y, roomData.scaling)

    const updateFrame = useCallback((): void => {
        const frames = sprite?.getFrames(getAnimationName(currentOrder, status, sprite), direction) || []
        if (!frames || isPaused) { return }
        if (currentOrder?.type === 'act') {
            const [currentAction] = currentOrder.steps
            if (!currentAction) { return }
            const { timeElapsed = 0, duration, reverse = false } = currentAction
            const frame = Math.floor(frames.length * (timeElapsed / duration))
            setFrameIndex(frame)
            setReverseCycle(reverse)
            setAnimationName(getAnimationName(currentOrder, status, sprite))
        } else {
            setFrameIndex(frameIndex => frameIndex + 1 < frames.length ? frameIndex + 1 : 0)
            setReverseCycle(false)
            setAnimationName(getAnimationName(currentOrder, status, sprite))
        }
    }, [currentOrder, status, direction, isPaused, sprite])

    const processClick: MouseEventHandler<SVGElement> | undefined = clickHandler
        ? (event): void => {
            event.stopPropagation()
            clickHandler(data, event.nativeEvent as PointerEvent)
        }
        : undefined

    const processContextClick: MouseEventHandler<SVGElement> | undefined = clickHandler
        ? (event): void => {
            event.stopPropagation()
            if (contextClickHandler) {
                event.preventDefault()
                contextClickHandler(data, event.nativeEvent as PointerEvent)
            }
        }
        : undefined

    useEffect(updateFrame, [updateFrame, direction, currentAnimation])
    useInterval(updateFrame, animationRate)

    if (sprite) {
        return (
            <>
                <SpriteShape
                    spriteObject={sprite}
                    animationName={animationName}
                    direction={direction}
                    frameIndex={frameIndex}
                    reverseCycle={reverseCycle}
                    // works - the Event definitions don't match, but stopPropagation is the only event method needed
                    clickHandler={processClick}
                    contextClickHandler={processContextClick}
                    handleHover={processClick ? handleHover : undefined}
                    hoverData={data}
                    x={x} y={y}
                    height={height * spriteScale}
                    width={width * spriteScale}
                    filter={filter}
                    status={data.status}
                />

                {!noSound && <>
                    {persistentSoundValues.map((soundValue, index) =>
                        <PersistentSound
                            key={index}
                            soundValue={soundValue}
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
            getImageAsset={getImageAsset}
            // works - the Event definitions don't match, but stopPropagation is the only event method needed
            clickHandler={processClick as unknown as MouseEventHandler<SVGElement>}
            handleHover={processClick ? handleHover : undefined}
            actorData={data}
            x={x} y={y}
            height={height * spriteScale} width={width * spriteScale}
            filter={filter}
            status={data.status}
        />
    )

}

