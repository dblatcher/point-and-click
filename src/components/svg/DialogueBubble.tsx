import {  FunctionComponent } from "react"
import { Order, RoomData, ActorData } from "@/definitions"
import { getScale } from "@/lib/getScale"
import { placeOnScreen } from "@/lib/roomFunctions"
import { clamp } from "@/lib/util"

const bubbleStyle = {
    border: '1px inset black',
    borderRadius: '.5rem',
    padding: '.125rem .5rem',
    backgroundColor: 'rgba(255,255,255,.75)',
}

export const DialogueBubble: FunctionComponent<{
    roomData: RoomData;
    roomScale: number;
    actorData: ActorData;
    orders?: Order[];
    viewAngle: number;
    fontFamily?: string;
}> = (props) => {
    const { roomData, roomScale, orders, actorData, viewAngle, fontFamily } = props

    const spriteScale = getScale(actorData.y, roomData.scaling)
    const y = actorData.y + (actorData.height * spriteScale)
    const x = placeOnScreen(actorData.x, viewAngle, roomData)

    if (!orders) { return null }

    const currentOrder: Order | undefined = orders[0]
    const text = currentOrder?.type === 'say'
        ? currentOrder.text
        : undefined;
    if (!text) {
        return null
    }

    // divide by roomScale to counteract the scalling of the room
    // IE text is not smaller when the room is zoomed out
    const width = 240 / roomScale
    const height = 40 / roomScale
    const fontSize = `${16 / roomScale}px`

    const centerLeft = x - width / 2
    const aX = clamp(centerLeft, roomData.frameWidth - width, 0)
    const aY = clamp(y + height, roomData.height, 0)

    const textAlign = aX > centerLeft ? 'left' : aX < centerLeft ? 'right' : 'center';

    return <svg
        style={{
            overflow: 'visible',
            pointerEvents: 'none',
        }}
        x={aX}
        y={roomData.height - aY} >
        <foreignObject x="0" y="0" width={width} height={height} style={{
            overflow: 'visible',
        }}>
            <div style={{
                textAlign,
                fontSize,
                height,
                fontFamily,
            }}>
                <span
                    style={{
                        ...bubbleStyle,
                        color: actorData.dialogueColor || 'black',
                        display: text ? 'inline-block' : 'none',
                    }}>{text}</span>
            </div>
        </foreignObject>
    </svg>

}
