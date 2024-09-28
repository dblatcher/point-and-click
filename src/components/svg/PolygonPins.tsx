import { Polygon } from "@/definitions/Zone";

interface Props {
    polygon: Polygon
}


interface PinProps {
    x: number,
    y: number,
    index: number,
    pinHeight?: number
}
const Pin = ({ x, y, index, pinHeight = 15 }: PinProps) => {
    return <>
        <line
            x1={x} x2={x} y1={-y} y2={-y - pinHeight}
            stroke={'black'} strokeWidth={1} />
        <circle cx={x} cy={-y - pinHeight} r={6} ></circle>
        <text x={x - 2} y={-y - pinHeight + 2} stroke="none" fill="white" fontSize={8}>{index + 1}</text>
    </>
}


export const PolygonPins = ({ polygon }: Props) => {
    return (
        <>
            {polygon.map(([x, y], index) => (
                <Pin key={index} index={index} x={x} y={y} />
            ))}
        </>)
}