import { h, FunctionalComponent } from "preact"
import { RoomData } from "src"
import { clamp } from "../lib/util"

const bubbleStyle = {
    border: '1px inset black',
    borderRadius: '.5rem',
    padding: '.125rem .5rem',
    backgroundColor: 'rgba(255,255,255,.75)',
}

export const DialogueBubble: FunctionalComponent<{
    text: string;
    x: number;
    y: number;
    roomData: RoomData;
    dialogueColor?: string;
    roomScale: number;
}> = (props) => {
    const { text, x, y, roomData, dialogueColor = 'black', roomScale } = props
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
            }}>
                <span
                    style={{
                        ...bubbleStyle,
                        color: dialogueColor,
                        display: text ? 'inline-block' : 'none',
                    }}>{text}</span>
            </div>
        </foreignObject>
    </svg>

}
