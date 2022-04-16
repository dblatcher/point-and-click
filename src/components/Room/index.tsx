import { h } from "preact";
import { RoomData, Zone } from "../../lib/RoomData";
import BackgroundShape from "./BackgroundShape";
import MarkerShape from "./MarkerShape";
import ZoneShape from "./ZoneShape";

interface Props {
    data: RoomData,
    scale?: number,
    markerX: number,
    viewAngle: number,
    handleRoomClick: { (x: number, y: number): void }
    handleZoneClick: { (zone: Zone): void }
}

export const Room = ({ data, scale = 1, markerX = 0, viewAngle, handleRoomClick, handleZoneClick }: Props) => {

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

                {data.zones.map(zone =>
                    <ZoneShape
                        zone={zone}
                        viewAngle={viewAngle}
                        roomData={data}
                        clickHandler={handleZoneClick}
                    />
                )}

                <MarkerShape x={markerX} viewAngle={viewAngle} roomData={data} />
            </svg>

            <figcaption>{data.name}</figcaption>
        </figure>
    )

}