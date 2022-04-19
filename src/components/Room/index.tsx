import { h, ComponentChildren } from "preact";
import { CellMatrix } from "../../lib/pathfinding/cells";
import { RoomData } from "../../lib/RoomData";
import { HotSpotZone } from "../../lib/Zone";
import { getShift } from "../../lib/util";
import styles from './styles.module.css';
import HotSpot from "./HotSpot";
import ZoneSvg from "../ZoneSvg";
import WalkableCellOverlay from "./WalkableCellOverLay";
import BackgroundShape from "./BackgroundShape";

interface Props {
    data: RoomData,
    scale?: number,
    viewAngle: number,
    handleRoomClick: { (x: number, y: number): void }
    handleHotSpotClick: { (zone: HotSpotZone): void }
    children?: ComponentChildren
    showWalkableAreas?: boolean
    walkableCells?: CellMatrix
}

export const Room = ({
    data,
    scale = 1,
    viewAngle,
    handleRoomClick,
    handleHotSpotClick,
    children,
    showWalkableAreas,
    walkableCells,
}: Props) => {

    const processRoomClick = (event: MouseEvent) => {
        return handleRoomClick(event.offsetX / scale, event.offsetY / scale)
    }
    const { name, frameWidth, height, background, hotspots, walkableAreas = [] } = data;

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

                {showWalkableAreas && walkableAreas.map(zone => {
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

                {walkableCells &&
                    <WalkableCellOverlay roomData={data} viewAngle={viewAngle} cellMatrix={walkableCells} />
                }

                {hotspots.map(zone =>
                    <HotSpot
                        zone={zone}
                        viewAngle={viewAngle}
                        roomData={data}
                        clickHandler={handleHotSpotClick}
                    />
                )}

                {children}
            </svg>

            <figcaption>{name}</figcaption>
        </figure>
    )

}