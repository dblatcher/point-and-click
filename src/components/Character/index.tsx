import { sprites } from "../../sprites"
import { RoomData } from "../../lib/RoomData"
import { placeOnScreen } from "../../lib/util";
import SpriteShape from "../SpriteShape";
import { useInterval } from "../../lib/useInterval"
import { useEffect, useState } from "preact/hooks";
import { Order } from "../../lib/Order";

interface Props {
    roomData: RoomData
    viewAngle: number
    x: number
    y: number
    height?: number
    width?: number
    sprite: string
    animationRate?: number
    orders?: Order[]
}


export default function Character({
    roomData, viewAngle, x, y, 
    height = 50, width = 50, sprite, 
    animationRate = 250,
    orders
}: Props) {
    const [currentOrder] = orders
    const text = currentOrder?.type === 'talk' ? currentOrder.steps[0].text : undefined;
    const sequence = currentOrder?.type === 'move' ? 'walk' : currentOrder?.type === 'talk' ? 'talk' : 'default'

    const frames = sprites[sprite].data.sequences[sequence]
    const [frameIndex, setFrameIndex] = useState(0)

    const updateFrame = () => {
        if (!frames) { return }
        const nextFrameIndex = frameIndex + 1 < frames.length ? frameIndex + 1 : 0
        setFrameIndex(nextFrameIndex)
    }


    // need tp set frameIndex to zero when sequence
    useEffect(() => {
        setFrameIndex(0)
    }, [sequence])


    useInterval(updateFrame, animationRate)

    return (
        <>
            <SpriteShape
                roomData={roomData}
                viewAngle={viewAngle}
                x={x} y={y}
                height={height} width={width}
                sprite={sprite}
                frameIndex={frameIndex}
                sequence={sequence}
            />
            <svg
                style={{ overflow: 'visible' }}
                x={placeOnScreen(x, viewAngle, roomData)}
                y={roomData.height - y - height} >
                <text
                    stroke={'white'}
                    fill={'black'}
                    stroke-width={.25}
                    font-size={10}
                    font-family='monospace'
                >{text}</text>
            </svg>
        </>
    )
}