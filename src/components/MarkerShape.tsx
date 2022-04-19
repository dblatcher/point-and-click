import { RoomData } from "../lib/RoomData"
import { placeOnScreen } from "../lib/util";
import styles from './styles.module.css';

interface Props {
    roomData: RoomData
    x: number
    y?: number
    height?: number
    viewAngle: number
    color: string
    text?: string
}

export default function MarkerShape({
    roomData, x, viewAngle, color, y=0, height=50, text
}: Props) {

    const textToDisplay = text || `${x.toFixed(0)},${y.toFixed(0)}`

    return (
        <svg
            style={{ overflow: 'visible' }}
            x={placeOnScreen(x, viewAngle, roomData)}
            y={roomData.height - y - height} >
            <rect
                style={{ fill: color, stroke: 'white' }}
                x={-5} y={0} width={10} height={height} />
            <text 
                stroke={'white'} 
                fill={'black'} 
                stroke-width={.25} 
                font-size={10} 
                font-family='monospace'
            >{textToDisplay}</text>
        </svg>
    )
}