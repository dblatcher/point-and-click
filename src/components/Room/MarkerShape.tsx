import { RoomData, Zone } from "../../lib/RoomData"
import { mapXvalue } from "../../lib/util";
import styles from './styles.module.css';

interface Props {
    roomData: RoomData
    x: number
}

export default function MarkerShape({
    roomData, x,

}: Props) {


    return (
        <svg
            style={{ overflow: 'visible' }}
            x={mapXvalue(x, 0, x, roomData)}
            y={roomData.height-50} >
            <rect className={styles.zone}
                style={{ fill: 'violet', stroke:'green' }}
                x={-5} y={0} width={10} height={50} />
        </svg>
    )
}