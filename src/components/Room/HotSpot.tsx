import { h } from "preact";
import { RoomData } from "../../definitions/RoomData"
import { HotspotZone } from "../../definitions/Zone"
import { getShift } from "../../lib/util";
import ZoneSvg from "../ZoneSvg";
import styles from './styles.module.css';

interface Props {
    zone: HotspotZone
    roomData: RoomData
    viewAngle: number
    clickHandler?: { (zone: HotspotZone): void }
    highlight?: boolean
}

export default function Hotspot({
    zone, roomData, viewAngle, highlight,
    clickHandler = (zone) => { console.log(zone) }
}: Props) {
    const { parallax } = zone

    const className = highlight ? styles.highlightedHotspot : styles.hotspot

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