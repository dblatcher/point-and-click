import ZoneSvg from "@/components/svg/ZoneSvg";
import { HotspotZone, RoomData } from "@/definitions";
import { getXShift, getYShift } from "@/lib/roomFunctions";
import { FunctionComponent } from "react";
import { HandleClickFunction, HandleHoverFunction } from "../../game/types";
import { hotpotClassNames } from "./zoneCssClasses";
import { useRoomRender } from "@/hooks/useRoomRender";

interface Props {
    zone: HotspotZone;
    clickHandler?: HandleClickFunction<HotspotZone>;
    contextClickHandler?: HandleClickFunction<HotspotZone>;
    handleHover?: HandleHoverFunction;
    highlight?: boolean;
    markVertices?: boolean;
    flash?: boolean;
    stopPropogation?: boolean;
}

const Hotspot: FunctionComponent<Props> = ({
    zone: hotspot, highlight, markVertices, stopPropogation = true,
    clickHandler, handleHover, contextClickHandler, flash = false,
}: Props) => {
    const { roomData, viewAngleX, viewAngleY } = useRoomRender()
    const { parallax, x, y } = hotspot
    return (
        <>
            <ZoneSvg
                className={hotpotClassNames({ markVertices, highlight, flash })}
                x={x + getXShift(viewAngleX, parallax, roomData)}
                y={roomData.height - y + getYShift(viewAngleY, parallax, roomData)}
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