import ZoneSvg from "@/components/svg/ZoneSvg";
import { HotspotZone, RoomData } from "@/definitions";
import { getShift } from "@/lib/roomFunctions";
import { FunctionComponent } from "react";
import { HandleHoverFunction } from "../../game";
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
    const { parallax, x, y, polygon } = hotspot
    const classNames = highlight ? [styles.highlightedHotspot] : [styles.hotspot]
    if (flash) { classNames.push(styles.flash) }
    return (
        <>
            <ZoneSvg
                className={classNames.join(" ")}
                x={x + getShift(viewAngle, parallax, roomData)}
                y={roomData.height - y}
                clickHandler={clickHandler}
                stopPropagation={stopPropogation}
                zone={hotspot}
                markVertices={markVertices}
                handleHover={handleHover}
            />
        </>
    )
}
export default Hotspot