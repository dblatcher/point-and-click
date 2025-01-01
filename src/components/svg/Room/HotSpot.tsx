import ZoneSvg from "@/components/svg/ZoneSvg";
import { HotspotZone, RoomData } from "@/definitions";
import { getShift } from "@/lib/roomFunctions";
import { FunctionComponent } from "react";
import { HandleClickFunction, HandleHoverFunction } from "../../game/types";
import { hotpotClassNames } from "./zoneCssClasses";

interface Props {
    zone: HotspotZone;
    roomData: RoomData;
    viewAngle: number;
    clickHandler?: HandleClickFunction<HotspotZone>;
    contextClickHandler?: HandleClickFunction<HotspotZone>;
    handleHover?: HandleHoverFunction;
    highlight?: boolean;
    markVertices?: boolean;
    flash?: boolean;
    stopPropogation?: boolean;
}

const Hotspot: FunctionComponent<Props> = ({
    zone: hotspot, roomData, viewAngle, highlight, markVertices, stopPropogation = true,
    clickHandler, handleHover, contextClickHandler, flash = false,
}: Props) => {
    const { parallax, x, y } = hotspot
    return (
        <>
            <ZoneSvg
                className={hotpotClassNames({ markVertices, highlight, flash })}
                x={x + getShift(viewAngle, parallax, roomData)}
                y={roomData.height - y}
                clickHandler={clickHandler}
                contextClickHandler={contextClickHandler}
                stopPropagation={stopPropogation}
                zone={hotspot}
                markVertices={markVertices}
                handleHover={handleHover}
            />
        </>
    )
}
export default Hotspot