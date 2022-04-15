import { RoomData, Zone } from "../../lib/RoomData"
import { mapXvalue } from "../../lib/util";
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
    const { path, circle, rect } = zone
    const shape = path ? 'path' : circle ? 'circle' : rect ? 'rect' : undefined;

    const processClick = (event: PointerEvent, zone) => {
        event.stopPropagation()
        clickHandler(zone)
    }

    return (
        <svg
            style={{ overflow: 'visible' }}
            x={mapXvalue(zone.x, zone.parallax, x, roomData)}
            y={zone.y} >

            {shape === 'path' &&
                <path className={styles.zone}
                    onClick={(event: PointerEvent) => { processClick(event, zone) }}
                    d={path} />
            }
            {shape === 'circle' &&
                <circle className={styles.zone}
                    onClick={(event: PointerEvent) => { processClick(event, zone) }}
                    cx={0} cy={0} r={circle} />
            }
            {shape === 'rect' &&
                <rect className={styles.zone}
                    onClick={(event: PointerEvent) => { processClick(event, zone) }}
                    x={0} y={0} width={rect[0]} height={rect[1]} />
            }
        </svg>
    )
}