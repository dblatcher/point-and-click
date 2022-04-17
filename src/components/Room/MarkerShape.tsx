import { RoomData } from "../../lib/RoomData"
import { placeOnScreen } from "../../lib/util";
import styles from './styles.module.css';

interface Props {
    roomData: RoomData
    x: number
    y?: number
    height?: number
    viewAngle: number
    color: string
}

export default function MarkerShape({
    roomData, x, viewAngle, color, y=0, height=50
}: Props) {

    return (
        <svg
            style={{ overflow: 'visible' }}
            x={placeOnScreen(x, viewAngle, roomData)}
            y={roomData.height - y - height} >
            <rect className={styles.zone}
                style={{ fill: color, stroke: 'white' }}
                x={-5} y={0} width={10} height={height} />
            <text 
                stroke={'white'} 
                fill={'black'} 
                stroke-width={.25} 
                font-size={10} 
                font-family='monospace'
            >{x.toFixed(1)},{y.toFixed(1)}</text>
        </svg>
    )
}