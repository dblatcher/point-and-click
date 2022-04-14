import { h } from "preact";
import { BackgroundLayer, RoomData } from "../../lib/RoomData"

interface Props {
    layer: BackgroundLayer;
    roomData: RoomData;
    scale: number;
    x: number;
}

function makeLayerStyle(
    layer: BackgroundLayer, roomData: RoomData, scale: number, x: number
): h.JSX.CSSProperties {
    const { url, parallax,  height = roomData.height } = layer

    const layerWidth = roomData.frameWidth + (parallax * (roomData.width - roomData.frameWidth))
    const offcenter = (x - (roomData.width / 2)) / roomData.width
    const offset = (offcenter + .5) * parallax * 100

    return {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundImage: `url(${url})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${layerWidth * scale}px ${height * scale}px`,
        backgroundPositionX: `${offset-25}%`,
        backgroundPositionY: 'bottom',
    }
}

export default function Background({ layer, roomData, scale, x }: Props) {

    return <div
        style={makeLayerStyle(layer, roomData, scale, x)}
    />
}