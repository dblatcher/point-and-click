import { h, ComponentChildren } from "preact";
import { CellMatrix } from "../../lib/pathfinding/cells";
import { RoomData } from "../../definitions/RoomData";
import { HotspotZone } from "../../definitions/Zone";
import { getShift } from "../../lib/util";
import styles from './styles.module.css';
import Hotspot from "./Hotspot";
import ZoneSvg from "../ZoneSvg";
import ObstacleCellOverlay from "./ObstableCellOverlay";
import BackgroundShape from "./BackgroundShape";

interface Props {
    data: RoomData,
    scale?: number,
    viewAngle: number,
    handleRoomClick: { (x: number, y: number): void }
    handleHotspotClick: { (zone: HotspotZone): void }
    children?: ComponentChildren
    showObstacleAreas?: boolean
    highlightHotspots?: boolean
    obstacleCells?: CellMatrix
}

export const Room = ({
    data,
    scale = 1,
    viewAngle,
    handleRoomClick,
    handleHotspotClick,
    children,
    showObstacleAreas,
    highlightHotspots,
    obstacleCells,
}: Props) => {

    const processRoomClick = (event: MouseEvent) => {
        return handleRoomClick(event.offsetX / scale, event.offsetY / scale)
    }
    const { name, frameWidth, height, background, hotspots, obstacleAreas = [] } = data;

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

                {showObstacleAreas && obstacleAreas.map(zone => {
                    const center = (frameWidth / 2) + getShift(viewAngle, 1, data)
                    const left = center - data.width / 2
                    return <ZoneSvg
                        className={styles.obstacleArea}
                        stopPropagation={false}
                        zone={zone}
                        x={zone.x + left}
                        y={data.height - zone.y}
                    />
                })}

                {obstacleCells &&
                    <ObstacleCellOverlay roomData={data} viewAngle={viewAngle} cellMatrix={obstacleCells} />
                }

                {hotspots.map(zone =>
                    <Hotspot
                        zone={zone}
                        viewAngle={viewAngle}
                        roomData={data}
                        highlight={highlightHotspots}
                        clickHandler={handleHotspotClick}
                    />
                )}

                {children}
            </svg>

            <figcaption>{name}</figcaption>
        </figure>
    )

}