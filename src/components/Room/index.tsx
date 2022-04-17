import { h, ComponentChildren } from "preact";
import { RoomData, Zone } from "../../lib/RoomData";
import BackgroundShape from "./BackgroundShape";
import MarkerShape from "../MarkerShape";
import HotSpot from "./HotSpot";

interface Props {
    data: RoomData,
    scale?: number,
    markerX: number,
    markerY: number,
    viewAngle: number,
    handleRoomClick: { (x: number, y: number): void }
    handleHotSpotClick: { (zone: Zone): void }
    children?: ComponentChildren
}

export const Room = ({
    data,
    scale = 1,
    markerX = 0,
    markerY,
    viewAngle,
    handleRoomClick,
    handleHotSpotClick,
    children,
}: Props) => {

    const processRoomClick = (event: MouseEvent) => {
        return handleRoomClick(event.offsetX / scale, event.offsetY / scale)
    }

    return (
        <figure style={{
            border: '1px solid black',
            width: `${data.frameWidth * scale}px`,
            height: `${data.height * scale}px`,
            position: 'relative',
        }}
            onClick={processRoomClick}
        >

            <svg xmlns="http://www.w3.org/2000/svg"
                style={{
                    position: "absolute",
                    width: '100%',
                    height: '100%',
                    left: 0,
                    top: 0,
                }} viewBox={`0 0 ${data.frameWidth} ${data.height}`}>

                {data.background.map(layer =>
                    <BackgroundShape
                        layer={layer}
                        viewAngle={viewAngle}
                        roomData={data}
                    />
                )}

                {data.hotspots.map(zone =>
                    <HotSpot
                        zone={zone}
                        viewAngle={viewAngle}
                        roomData={data}
                        clickHandler={handleHotSpotClick}
                    />
                )}

                <MarkerShape y={10} height={20} x={data.width * 0} viewAngle={viewAngle} roomData={data} color='blue' />
                <MarkerShape y={10} height={20} x={data.width * .25} viewAngle={viewAngle} roomData={data} color='blue' />
                <MarkerShape y={10} height={20} x={data.width * .5} viewAngle={viewAngle} roomData={data} color='blue' />
                <MarkerShape y={10} height={20} x={data.width * .75} viewAngle={viewAngle} roomData={data} color='blue' />
                <MarkerShape y={10} height={20} x={data.width * 1} viewAngle={viewAngle} roomData={data} color='blue' />

                {children}

            </svg>

            <figcaption>{data.name}</figcaption>
        </figure>
    )

}