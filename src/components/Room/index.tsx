import { h, ComponentChildren } from "preact";
import { RoomData } from "../../lib/RoomData";
import { HotSpotZone } from "../../lib/Zone";
import BackgroundShape from "./BackgroundShape";
import MarkerShape from "../MarkerShape";
import HotSpot from "./HotSpot";
import ZoneSvg from "../ZoneSvg";
import styles from './styles.module.css';
import { getShift } from "../../lib/util";

interface Props {
    data: RoomData,
    scale?: number,
    viewAngle: number,
    handleRoomClick: { (x: number, y: number): void }
    handleHotSpotClick: { (zone: HotSpotZone): void }
    children?: ComponentChildren
}

export const Room = ({
    data,
    scale = 1,
    viewAngle,
    handleRoomClick,
    handleHotSpotClick,
    children,
}: Props) => {

    const processRoomClick = (event: MouseEvent) => {
        return handleRoomClick(event.offsetX / scale, event.offsetY / scale)
    }
    const { name, frameWidth, width, height, background, hotspots, walkableAreas = [] } = data;

    return (
        <figure style={{
            border: '1px solid black',
            width: `${frameWidth * scale}px`,
            height: `${height * scale}px`,
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
                }} viewBox={`0 0 ${frameWidth} ${height}`}>

                {background.map(layer =>
                    <BackgroundShape
                        layer={layer}
                        viewAngle={viewAngle}
                        roomData={data}
                    />
                )}

                {walkableAreas.map(zone => {
                    const center = (frameWidth / 2) + getShift(viewAngle, 1, data)
                    const left = center - data.width / 2
                    return <ZoneSvg
                        className={styles.walkableArea}
                        stopPropagation={false}
                        zone={zone}
                        x={zone.x + left}
                        y={data.height - zone.y}
                    />
                })}

                {hotspots.map(zone =>
                    <HotSpot
                        zone={zone}
                        viewAngle={viewAngle}
                        roomData={data}
                        clickHandler={handleHotSpotClick}
                    />
                )}

                <MarkerShape y={10} height={20} x={width * 0} viewAngle={viewAngle} roomData={data} color='blue' />
                <MarkerShape y={10} height={20} x={width * .25} viewAngle={viewAngle} roomData={data} color='blue' />
                <MarkerShape y={10} height={20} x={width * .5} viewAngle={viewAngle} roomData={data} color='blue' />
                <MarkerShape y={10} height={20} x={width * .75} viewAngle={viewAngle} roomData={data} color='blue' />
                <MarkerShape y={10} height={20} x={width * 1} viewAngle={viewAngle} roomData={data} color='blue' />

                {children}

            </svg>

            <figcaption>{name}</figcaption>
        </figure>
    )

}