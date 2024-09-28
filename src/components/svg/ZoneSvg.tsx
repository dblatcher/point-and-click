import { FunctionComponent, MouseEventHandler } from "react";
import { polygonToPathD } from "@/lib/polygonToPathD";
import { Zone, HotspotZone } from "@/definitions"
import { HandleHoverFunction } from "../game";
import { PolygonPins } from "./PolygonPins";

interface Props {
    zone: Zone;
    x: number;
    y: number;
    className?: string;
    stopPropagation?: boolean;
    // HotspotZone is a subtype of Zone but not assignable to Zone or (Zone|HotspotZone)
    clickHandler?: { (zone: any): void };
    handleHover?: HandleHoverFunction;
    markVertices?: boolean;
}

const ZoneSvg: FunctionComponent<Props> = ({
    zone, x, y, className, stopPropagation = true,
    markVertices = false,
    clickHandler, handleHover,
}: Props) => {
    const { path, circle, rect, polygon } = zone

    const processClick: MouseEventHandler<SVGElement> = (event) => {
        if (stopPropagation) { event.stopPropagation() }
        if (clickHandler) { clickHandler(zone) }
    }

    const shouldReportHover = handleHover && zone.type === 'hotspot';
    const onMouseEnter = shouldReportHover ? () => { handleHover(zone as HotspotZone, 'enter') } : undefined
    const onMouseLeave = shouldReportHover ? () => { handleHover(zone as HotspotZone, 'leave') } : undefined

    return (
        <svg x={x} y={y} style={{ overflow: 'visible' }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {polygon && <>
                <path className={className}
                    onClick={processClick}
                    d={polygonToPathD(polygon)} />
                {markVertices && <PolygonPins polygon={polygon} />}
            </>
            }
            {path &&
                <path className={className}
                    onClick={processClick}
                    d={path} />
            }
            {circle &&
                <circle className={className}
                    onClick={processClick}
                    cx={0} cy={0} r={circle} />
            }
            {rect &&
                <rect className={className}
                    onClick={processClick}
                    x={0} y={0} width={rect[0]} height={rect[1]} />
            }
        </svg>
    )
}

export default ZoneSvg