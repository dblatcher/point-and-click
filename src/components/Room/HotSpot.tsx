import { RoomData } from "../../definitions/RoomData"
import { HotSpotZone } from "../../definitions/Zone"
import { getShift } from "../../lib/util";
import ZoneSvg from "../ZoneSvg";
import styles from './styles.module.css';

interface Props {
    zone: HotSpotZone
    roomData: RoomData
    viewAngle: number
    clickHandler?: { (zone: HotSpotZone): void }
    highlight?: boolean
}

export default function HotSpot({
    zone, roomData, viewAngle, highlight,
    clickHandler = (zone) => { console.log(zone) }
}: Props) {
    const { parallax } = zone

    const className = highlight ? styles.highlightedHotSpot : styles.hotSpot

    return (
        <ZoneSvg
            className={className}
            x={zone.x + getShift(viewAngle, parallax, roomData)}
            y={roomData.height - zone.y}
            clickHandler={clickHandler}
            stopPropagation={true}
            zone={zone} />
    )
}