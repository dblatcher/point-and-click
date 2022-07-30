import { h, FunctionalComponent } from "preact"
import { RoomData } from "src"
import { clamp } from "../lib/util"

export const DialogueBubble: FunctionalComponent<{
    text: string;
    x: number;
    y: number;
    roomData: RoomData;
    dialogueColor?: string;
    roomScale: number;
}> = (props) => {

    const { text, x, y, roomData, dialogueColor = 'black', roomScale } = props
    const width = 160 / roomScale
    const height = 40 / roomScale
    const centerLeft = x - width / 2
    const aX = clamp(centerLeft, roomData.frameWidth - width, 0)
    const textAlign = aX > centerLeft ? 'left' : aX < centerLeft ? 'right' : 'center';

    return <svg
        style={{ overflow: 'visible', pointerEvents: 'none' }}
        x={aX}
        y={y} >
        <foreignObject x="0" y="0" width={width} height={height} style={{ overflow: 'visible' }}>
            <div style={{
                textAlign,
                fontSize: `${16 / roomScale}px`,
                transform: 'translateY(-100%)'
            }}>
                <span style={{
                    color: dialogueColor,
                    border: '1px inset black',
                    borderRadius: '.5rem',
                    padding: '.125rem .5rem',
                    display: text ? 'inline-block' : 'none',
                    backgroundColor: 'rgba(255,255,255,.75)',
                }}>{text}</span>
            </div>
        </foreignObject>
    </svg>

}
