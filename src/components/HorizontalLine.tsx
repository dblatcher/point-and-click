import { RoomData } from "../definitions/RoomData"
import { placeOnScreen } from "../lib/util";

interface Props {
    roomData: RoomData
    y: number
    color?: string
    text?: string
}

export default function HorizontalLine({
    roomData, color = 'red', y = 0, text
}: Props) {

    const textToDisplay = text || y.toFixed(0)

    return (<>
        <line x1={0} y1={roomData.height - y} x2={roomData.frameWidth} y2={roomData.height - y} stroke={color} stroke-dasharray="4 3" />
        <text
            x={0}
            y={roomData.height - y}
            stroke={'white'}
            fill={'black'}
            stroke-width={.25}
            font-size={15}
            font-family='monospace'
        >{textToDisplay}</text>
    </>
    )
}