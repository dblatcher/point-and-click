import { sprites } from "../../data/sprites"
import { RoomData } from "../lib/RoomData"
import { placeOnScreen } from "../lib/util";
import SpriteShape from "./SpriteShape";
import { useInterval } from "../lib/useInterval"
import { useLayoutEffect, useState } from "preact/hooks";
import { CharacterData } from "../lib/CharacterData";

interface Props {
    roomData: RoomData
    viewAngle: number
    characterData: CharacterData
    animationRate?: number
    clickHandler?: { (character: CharacterData): void }
    key: string | number
}


export default function Character({
    roomData, viewAngle,
    animationRate = 250, characterData,
    clickHandler
}: Props) {
    const {
        orders,
        x, y,
        height = 50, width = 50, sprite, filter, dialogueColor
    } = characterData
    const [currentOrder] = orders
    const text = currentOrder?.type === 'talk' ? currentOrder.steps[0].text : undefined;
    const sequence = currentOrder?.type === 'move' ? 'walk' : currentOrder?.type === 'talk' ? 'talk' : 'default'
    const spriteObject = sprites[sprite]
    const direction = characterData.direction || spriteObject.data.defaultDirection;
    const frames = spriteObject.getFrames(sequence, direction)

    const [frameIndex, setFrameIndex] = useState(0)

    const updateFrame = () => {
        if (!frames) { return }
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
            clickHandler(characterData)
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
                frameIndex={frameIndex}
                sequence={sequence}
                direction={direction}
                filter={filter}
            />
            <svg
                style={{ overflow: 'visible' }}
                x={placeOnScreen(x, viewAngle, roomData)}
                y={roomData.height - y - height} >
                <text
                    stroke={'black'}
                    fill={dialogueColor || 'white'}
                    stroke-width={.25}
                    font-size={12}
                    font-family='arial'
                >{text}</text>
            </svg>
        </>
    )
}