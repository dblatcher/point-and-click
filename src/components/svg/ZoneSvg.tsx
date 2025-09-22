import { FunctionComponent, MouseEventHandler } from "react";
import { polygonToPathD } from "@/lib/polygonToPathD";
import { Zone, HotspotZone } from "@/definitions"
import { HandleClickFunction, HandleHoverFunction } from "../game/types";
import { PolygonPins } from "./PolygonPins";
import { CirclePins } from "./CirclePins";
import { RectanglePins } from "./RectanglePins";

interface Props {
    zone: Zone;
    x: number;
    y: number;
    className?: string;
    stopPropagation?: boolean;
    clickHandler?: HandleClickFunction<HotspotZone>;
    contextClickHandler?: HandleClickFunction<HotspotZone>;
    handleHover?: HandleHoverFunction;
    markVertices?: boolean;
}

const ZoneSvg: FunctionComponent<Props> = ({
    zone, x, y, className, stopPropagation = true,
    markVertices = false,
    clickHandler, contextClickHandler, handleHover,
}: Props) => {
    const { path, circle, rect, polygon, type } = zone
    const hotspot = zone.type === 'hotspot' ? zone as HotspotZone : undefined;

    const processClick: MouseEventHandler<SVGElement> = (event) => {
        if (stopPropagation) { event.stopPropagation() }
        if (clickHandler && hotspot) { clickHandler(hotspot, event.nativeEvent as PointerEvent) }
    }

    const processContextClick: MouseEventHandler<SVGElement> = (event) => {
        if (stopPropagation) { event.stopPropagation() }
        if (contextClickHandler) {
            event.preventDefault()
        }
        if (contextClickHandler && hotspot) { contextClickHandler(hotspot, event.nativeEvent as PointerEvent) }
    }

    const shouldReportHover = !!(hotspot && handleHover);
    const onMouseEnter = shouldReportHover ? () => { handleHover(hotspot, 'enter') } : undefined
    const onMouseLeave = shouldReportHover ? () => { handleHover(hotspot, 'leave') } : undefined

    return (
        <svg x={x} y={y} style={{ overflow: 'visible' }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {polygon && <>
                <path className={className}
                    onClick={processClick}
                    onContextMenu={processContextClick}
                    d={polygonToPathD(polygon)} />
                {markVertices && <PolygonPins polygon={polygon} />}
            </>
            }
            {path &&
                <path className={className}
                    onClick={processClick}
                    onContextMenu={processContextClick}
                    d={path} />
            }
            {circle &&
                <>
                    <circle className={className}
                        onClick={processClick}
                        onContextMenu={processContextClick}
                        cx={0} cy={0} r={circle} />
                    {markVertices && <CirclePins radius={circle} />}
                </>
            }
            {rect &&
                <>
                    <rect className={className}
                        onClick={processClick}
                        onContextMenu={processContextClick}
                        x={0} y={0} width={rect[0]} height={rect[1]} />
                    {markVertices && <RectanglePins width={rect[0]} height={rect[1]} />}
                </>
            }
        </svg>
    )
}

export default ZoneSvg