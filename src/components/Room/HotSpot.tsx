import { h, FunctionalComponent } from "preact";
import { RoomData } from "../../definitions/RoomData"
import { HotspotZone } from "../../definitions/Zone"
import { getShift } from "../../lib/util";
import { HandleHoverFunction } from "../Game";
import ZoneSvg from "../ZoneSvg";
import styles from './styles.module.css';

interface Props {
    zone: HotspotZone;
    roomData: RoomData;
    viewAngle: number;
    clickHandler?: { (hotspot: HotspotZone): void };
    handleHover?: HandleHoverFunction;
    highlight?: boolean;
    markVertices?: boolean;
    stopPropogation?: boolean;
}

const Hotspot: FunctionalComponent<Props> = ({
    zone: hotspot, roomData, viewAngle, highlight, markVertices, stopPropogation = true,
    clickHandler, handleHover
}: Props) => {
    const { parallax } = hotspot

    const className = highlight ? styles.highlightedHotspot : styles.hotspot

    return (
        <ZoneSvg
            className={className}
            x={hotspot.x + getShift(viewAngle, parallax, roomData)}
            y={roomData.height - hotspot.y}
            clickHandler={clickHandler}
            stopPropagation={stopPropogation}
            zone={hotspot}
            markVertices={markVertices}
            handleHover={handleHover}
        />
    )
}
export default Hotspot