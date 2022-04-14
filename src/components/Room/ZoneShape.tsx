import { RoomData, Zone } from "../../lib/RoomData"
import styles from './styles.module.css';

interface Props {
    zone: Zone
    roomData: RoomData
    x: number
    clickHandler?: { (zone: Zone): void }
}

export default function ZoneShape({
    zone, roomData, x,
    clickHandler = (zone) => { console.log(zone) }
}: Props) {
    const { parallax, path, circle, rect } = zone
    const { width, frameWidth } = roomData

    const shape = path ? 'path' : circle ? 'circle' : rect ? 'rect' : undefined;

    return (
        <svg
            style={{ overflow: 'visible' }}
            x={zone.x - parallax ** 2 * (x * (frameWidth / width))}
            y={zone.y} >

            {shape === 'path' &&
                <path className={styles.zone}
                    onClick={() => { clickHandler(zone) }}
                    d={path} />
            }
            {shape === 'circle' &&
                <circle className={styles.zone}
                    onClick={() => { clickHandler(zone) }}
                    cx={0} cy={0} r={circle} />
            }
            {shape === 'rect' &&
                <rect className={styles.zone}
                    onClick={() => { clickHandler(zone) }}
                    x={0} y={0} width={rect[0]} height={rect[1]} />
            }
        </svg>
    )
}