import { h } from "preact";
import { BackgroundLayer, RoomData } from "../../lib/RoomData";
import Background from "./Background";
import ZoneShape from "./ZoneShape";

interface Props {
    data: RoomData,
    scale?: number,
    x?: number,
}

function Marker(props: { scaledX: number }) {
    return <div style={{
        display: 'inlineBlock',
        width: '10px',
        height: '30px',
        position: 'absolute',
        backgroundColor: 'violet',
        left: `${props.scaledX}px`,
        bottom: '0',
        transform: 'translateX(-50%)'
    }}></div>
}

export const Room = ({ data, scale = 1, x = 0 }: Props) => {

    const scaledX = x * scale * (data.frameWidth / data.width)



    return (
        <figure style={{
            border: '1px solid black',
            width: `${data.frameWidth * scale}px`,
            height: `${data.height * scale}px`,
            position: 'relative',
        }}>
            {data.background.map(layer =>
                <Background
                    roomData={data} layer={layer}
                    x={x} scale={scale}
                />
            )}

            <svg xmlns="http://www.w3.org/2000/svg"
                style={{
                    position: "absolute",
                    width: '100%',
                    height: '100%',
                    left: 0,
                    top: 0,
                }} viewBox={`0 0 ${data.frameWidth} ${data.height}`}>

                {data.zones.map(zone =>
                    <ZoneShape
                        zone={zone} roomData={data} x={x} />
                )}

            </svg>

            <Marker {...{ scaledX }} />
            <figcaption>{data.name}</figcaption>
        </figure>
    )

}