import { h } from "preact";
import { BackgroundLayer, RoomData } from "../../lib/RoomData";
import ZoneShape from "./Zone";

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

function makeLayerStyle(
    layer: BackgroundLayer, data: RoomData, scale: number, x: number
): h.JSX.CSSProperties {

    const { frameWidth } = data
    const { url, parallax, width = frameWidth, height = data.height } = layer

    const offcenter = (x - (data.width / 2)) / data.width
    const offset = (offcenter + .5) * parallax * 100

    return {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundImage: `url(${url})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${width * scale}px ${height * scale}px`,
        backgroundPositionX: `${offset}%`,
        backgroundPositionY: 'bottom',
    }
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
            {data.background.map((layer, index) => (
                <div key={index}
                    style={makeLayerStyle(layer, data, scale, x)}
                />
            ))}


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