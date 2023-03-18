import {  FunctionComponent } from "react";
import { RoomData } from "src"
import { HotspotZone } from "src"
import { getShift } from "../../lib/roomFunctions";
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
    flash?: boolean;
    stopPropogation?: boolean;
}

const Hotspot: FunctionComponent<Props> = ({
    zone: hotspot, roomData, viewAngle, highlight, markVertices, stopPropogation = true,
    clickHandler, handleHover, flash = false,
}: Props) => {
    const { parallax } = hotspot

    const classNames = highlight ? [styles.highlightedHotspot] : [styles.hotspot]

    if (flash) { classNames.push(styles.flash)}

    return (
        <ZoneSvg
            className={classNames.join(" ")}
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