import { RoomData } from "../definitions/RoomData"
import { clamp } from "../lib/util"

export const DialogueBubble = (props: { text: string, x: number, y: number, roomData: RoomData, dialogueColor: string }) => {

    const { text, x, y, roomData, dialogueColor } = props
    const width = 160
    const height = 40
    const centerLeft = x - width / 2
    const aX = clamp(centerLeft, roomData.frameWidth - width, 0)
    const textAlign = aX > centerLeft ? 'left' : aX < centerLeft ? 'right' : 'center';

    return <svg
        style={{ overflow: 'visible', pointerEvents: 'none' }}
        x={aX}
        y={y} >
        <foreignObject x="0" y="0" width={width} height={height} style={{ overflow: 'visible' }}>
            <div xmlns="http://www.w3.org/1999/xhtml" style={{
                textAlign,
                fontSize: '.5rem',
                transform: 'translateY(-100%)'
            }}>
                <span style={{
                    color: dialogueColor,
                    border: '1px inset black',
                    borderRadius: '.5rem',
                    padding: '.125rem .5rem',
                    display: text? 'inline-block' : 'none',
                    backgroundColor: 'rgba(255,255,255,.75)',
                }}>{text}</span>
            </div>
        </foreignObject>
    </svg>

}
