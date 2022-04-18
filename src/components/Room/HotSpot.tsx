import { RoomData } from "../../lib/RoomData"
import { HotSpotZone } from "../../lib/Zone"
import { getShift } from "../../lib/util";
import ZoneSvg from "../ZoneSvg";
import styles from './styles.module.css';

interface Props {
    zone: HotSpotZone
    roomData: RoomData
    viewAngle: number
    clickHandler?: { (zone: HotSpotZone): void }
}

export default function HotSpot({
    zone, roomData, viewAngle,
    clickHandler = (zone) => { console.log(zone) }
}: Props) {
    const { parallax } = zone

    return (
        <ZoneSvg
            className={styles.hotSpot}
            x={zone.x + getShift(viewAngle, parallax, roomData)}
            y={zone.y}
            clickHandler={clickHandler}
            stopPropagation={true}
            zone={zone} />
    )
}