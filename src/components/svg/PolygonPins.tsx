import { Polygon } from "point-click-lib";
import { Pin } from "./Pin";

interface Props {
    polygon: Polygon
}


export const PolygonPins = ({ polygon }: Props) => {
    return (
        <>
            {polygon.map(([x, y], index) => (
                <Pin key={index} label={(index + 1).toString()} x={x} y={y} />
            ))}
        </>)
}