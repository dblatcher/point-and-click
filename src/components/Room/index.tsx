import { h } from "preact";
import { BackgroundLayer, RoomData } from "../../lib/RoomData";

interface Props {
    data: RoomData,
    scale?: number,
    x?: number,
}

function makeLayerStyle(
    layer: BackgroundLayer, data: RoomData, scale: number, x: number
): h.JSX.CSSProperties {

    const { frameWidth, width: roomWidth } = data
    const { url, parallax, width = frameWidth, height = data.height } = layer

    const offcenter = (x - (roomWidth / 2)) / roomWidth

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

            <div style={{
                display: 'inlineBlock',
                width: '10px',
                height: '30px',
                position: 'absolute',
                backgroundColor: 'violet',
                left: `${scaledX}px`,
                bottom: '0',
                transform: 'translateX(-50%)'
            }}></div>
            <figcaption>{data.name}</figcaption>
        </figure>
    )

}