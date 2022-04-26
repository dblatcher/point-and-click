import { polygonToPathD } from "../lib/polygonToPathD";
import { Zone } from "../definitions/Zone"

interface Props {
    zone: Zone
    x: number,
    y: number,
    className?: string,
    stopPropagation?: boolean
    clickHandler?: { (zone: Zone): void }
}

export default function ZoneSvg({
    zone, x, y, className, stopPropagation = true,
    clickHandler = null
}: Props) {
    const { path, circle, rect, polygon } = zone
    const shape = polygon ? 'polygon' : path ? 'path' : circle ? 'circle' : rect ? 'rect' : undefined;

    const processClick = clickHandler
        ? (event: PointerEvent) => {
            if (stopPropagation) { event.stopPropagation() }
            clickHandler(zone)
        }
        : null

    return (
        <svg x={x} y={y} style={{ overflow: 'visible' }}>
            {shape === 'polygon' &&
                <path className={className}
                    onClick={processClick}
                    d={polygonToPathD(polygon)} />
            }
            {shape === 'path' &&
                <path className={className}
                    onClick={processClick}
                    d={path} />
            }
            {shape === 'circle' &&
                <circle className={className}
                    onClick={processClick}
                    cx={0} cy={0} r={circle} />
            }
            {shape === 'rect' &&
                <rect className={className}
                    onClick={processClick}
                    x={0} y={0} width={rect[0]} height={rect[1]} />
            }
        </svg>
    )
}