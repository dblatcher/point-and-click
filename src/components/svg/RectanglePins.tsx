import { Pin } from "./Pin";

interface Props {
    width: number
    height: number
}


export const RectanglePins = ({ width, height }: Props) => {

    return (
        <>
            <Pin label={"R"} x={0} y={0} pinTilt={-5} />
            <Pin label={"r"} x={width} y={0} pinTilt={5} pinHeight={10} />
            <Pin label={"r"} x={0} y={-height} pinTilt={-5} pinHeight={10} />
            <Pin label={"r"} x={width} y={-height} pinTilt={5} pinHeight={10} />
        </>
    )
}