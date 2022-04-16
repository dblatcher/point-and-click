import { RoomData, Zone } from "../../lib/RoomData"
import { getShift } from "../../lib/util";
import styles from './styles.module.css';

interface Props {
    roomData: RoomData
    x: number
    viewAngle:number
}

export default function MarkerShape({
    roomData, x, viewAngle
}: Props) {

    return (
        <svg
            style={{ overflow: 'visible' }}
            x={x + getShift(viewAngle,1,roomData)}
            y={roomData.height-50} >
            <rect className={styles.zone}
                style={{ fill: 'violet', stroke:'green' }}
                x={-5} y={0} width={10} height={50} />
        </svg>
    )
}