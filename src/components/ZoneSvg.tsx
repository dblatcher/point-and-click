import { FunctionalComponent, h, Fragment } from "preact";
import { polygonToPathD } from "../lib/polygonToPathD";
import { Zone, HotspotZone } from "../definitions/Zone"
import { JSXInternal } from "preact/src/jsx";
import { HandleHoverFunction } from "./Game";

interface Props {
    zone: Zone;
    x: number;
    y: number;
    className?: string;
    stopPropagation?: boolean;
    // HotspotZone is a subtype of Zone but not assignable to Zone or (Zone|HotspotZone)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clickHandler?: { (zone: any): void };
    handleHover?: HandleHoverFunction;
    markVertices?: boolean;
}

const plotVertex = (point: [number, number], index: number) => (
    <g key={index} style={{ stroke: 'red' }}>
        <line
            x1={point[0] - 5}
            x2={point[0] + 5}
            y1={-point[1] - 5}
            y2={-point[1] + 5} />
        <line
            x1={point[0] + 5}
            x2={point[0] - 5}
            y1={-point[1] - 5}
            y2={-point[1] + 5} />
    </g>
)

const ZoneSvg: FunctionalComponent<Props> = ({
    zone, x, y, className, stopPropagation = true,
    markVertices = false,
    clickHandler, handleHover,
}: Props) => {
    const { path, circle, rect, polygon } = zone

    const processClick: JSXInternal.MouseEventHandler<SVGElement> = (event) => {
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
                {markVertices && polygon.map(plotVertex)}
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