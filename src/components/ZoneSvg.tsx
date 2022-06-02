import { h } from "preact";
import { polygonToPathD } from "../lib/polygonToPathD";
import { Zone } from "../definitions/Zone"
import { JSXInternal } from "preact/src/jsx";

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
    clickHandler
}: Props) {
    const { path, circle, rect, polygon } = zone

    const processClick: JSXInternal.MouseEventHandler<SVGElement> = (event) => {
        if (stopPropagation) { event.stopPropagation() }
        if (clickHandler) { clickHandler(zone) }
    }

    return (
        <svg x={x} y={y} style={{ overflow: 'visible' }}>
            {polygon &&
                <path className={className}
                    onClick={processClick}
                    d={polygonToPathD(polygon)} />
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