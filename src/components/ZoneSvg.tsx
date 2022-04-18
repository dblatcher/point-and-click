import { polygonToPathD } from "../lib/Polygon";
import { Zone } from "../lib/Zone"

interface Props {
    zone: Zone
    x: number,
    y: number,
    className?: string,
    stopPropagation?: boolean
    clickHandler?: { (zone: Zone): void }
}

export default function ZoneSvg({
    zone, x, y, className, stopPropagation,
    clickHandler = () => { }
}: Props) {
    const { path, circle, rect, polygon } = zone
    const shape = polygon ? 'polygon' : path ? 'path' : circle ? 'circle' : rect ? 'rect' : undefined;

    const processClick = (event: PointerEvent, zone) => {
        if (stopPropagation) { event.stopPropagation() }
        clickHandler(zone)
    }

    return (
        <svg
            style={{ overflow: 'visible' }}
            x={x}
            y={y} >

            {shape === 'polygon' &&
                <path className={className}
                    onClick={(event: PointerEvent) => { processClick(event, zone) }}
                    d={polygonToPathD(polygon)} />
            }
            {shape === 'path' &&
                <path className={className}
                    onClick={(event: PointerEvent) => { processClick(event, zone) }}
                    d={path} />
            }
            {shape === 'circle' &&
                <circle className={className}
                    onClick={(event: PointerEvent) => { processClick(event, zone) }}
                    cx={0} cy={0} r={circle} />
            }
            {shape === 'rect' &&
                <rect className={className}
                    onClick={(event: PointerEvent) => { processClick(event, zone) }}
                    x={0} y={0} width={rect[0]} height={rect[1]} />
            }
        </svg>
    )
}