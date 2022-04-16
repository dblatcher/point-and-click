import { RoomData } from "../../lib/RoomData"
import { placeOnScreen } from "../../lib/util";
import styles from './styles.module.css';

interface Props {
    roomData: RoomData
    x: number
    viewAngle: number
    color: string
}

export default function MarkerShape({
    roomData, x, viewAngle, color
}: Props) {

    return (
        <svg
            style={{ overflow: 'visible' }}
            x={placeOnScreen(x, viewAngle, roomData)}
            y={roomData.height - 50} >
            <rect className={styles.zone}
                style={{ fill: color, stroke: 'white' }}
                x={-5} y={0} width={10} height={50} />
            <text stroke={'white'} fill={'red'}>{x.toFixed(1)}</text>
        </svg>
    )
}