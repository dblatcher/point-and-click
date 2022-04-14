import { RoomData, Zone } from "../../lib/RoomData"
import styles from  './styles.module.css';

interface Props {
    zone: Zone
    roomData: RoomData
    x: number
}

export default function ZoneShape({zone, roomData, x}:Props) {
    const { parallax, path, name } = zone
    const { width, frameWidth } = roomData

    return (
        <svg 
            style={{
                overflow:'visible'
            }}
            x={zone.x - parallax**2 * (x * (frameWidth / width))}
            y={zone.y} >

            <path className={styles.zone}
                style={{
                    pointerEvents:'all'
                }}
                onClick={() => { console.log(name) }}
                d={path} />
        </svg>
    )
}