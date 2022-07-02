import { h, ComponentChildren, FunctionComponent } from "preact";
import { CellMatrix } from "../../lib/pathfinding/cells";
import { RoomData } from "../../definitions/RoomData";
import { HotspotZone } from "../../definitions/Zone";
import { getShift } from "../../lib/util";
import styles from './styles.module.css';
import Hotspot from "./Hotspot";
import ZoneSvg from "../ZoneSvg";
import ObstacleCellOverlay from "./ObstableCellOverlay";
import BackgroundShape from "./BackgroundShape";
import { HandleHoverFunction } from "../Game";

interface Props {
    data: RoomData;
    scale?: number;
    viewAngle: number;
    handleRoomClick: { (x: number, y: number): void };
    handleHotspotClick?: { (zone: HotspotZone): void };
    handleHover?: HandleHoverFunction;
    children?: ComponentChildren;
    showObstacleAreas?: boolean;
    highlightHotspots?: boolean;
    obstacleCells?: CellMatrix;
    markHotspotVertices?: number[];
    markObstacleVertices?: number[];
    showCaption?: boolean;
}

export const Room: FunctionComponent<Props> = ({
    data,
    scale = 1,
    viewAngle,
    handleRoomClick,
    handleHotspotClick,
    handleHover,
    children,
    showObstacleAreas,
    highlightHotspots,
    obstacleCells,
    markHotspotVertices = [],
    markObstacleVertices = [],
    showCaption = false,
}: Props) => {

    const processRoomClick = (event: MouseEvent): void => {
        return handleRoomClick(event.offsetX / scale, event.offsetY / scale)
    }
    const { name, frameWidth, height, background, hotspots = [], obstacleAreas = [] } = data;

    return (
        <figure className={styles.roomFigure}
            style={{
                width: `${frameWidth * scale}px`,
                height: `${height * scale}px`,
                position: 'relative',
            }}
            onClick={processRoomClick}
        >

            <svg xmlns="http://www.w3.org/2000/svg"
                className={styles.roomSvg}
                viewBox={`0 0 ${frameWidth} ${height}`}>

                {background.map((layer, index) =>
                    <BackgroundShape key={index}
                        layer={layer}
                        viewAngle={viewAngle}
                        roomData={data}
                    />
                )}

                {showObstacleAreas && obstacleAreas.map((zone, index) => {
                    const center = (frameWidth / 2) + getShift(viewAngle, 1, data)
                    const left = center - data.width / 2
                    return <ZoneSvg key={index}
                        className={styles.obstacleArea}
                        stopPropagation={false}
                        zone={zone}
                        x={zone.x + left}
                        y={data.height - zone.y}
                        markVertices={markObstacleVertices.includes(index)}
                    />
                })}

                {obstacleCells &&
                    <ObstacleCellOverlay roomData={data} viewAngle={viewAngle} cellMatrix={obstacleCells} />
                }

                {hotspots.map((zone, index) =>
                    <Hotspot key={index}
                        zone={zone}
                        viewAngle={viewAngle}
                        roomData={data}
                        highlight={highlightHotspots}
                        clickHandler={handleHotspotClick}
                        stopPropogation={!!handleHotspotClick}
                        handleHover={handleHover}
                        markVertices={markHotspotVertices.includes(index)}
                    />
                )}

                {children}
            </svg>

            {showCaption && (
                <figcaption className={styles.roomCaption}>{name}</figcaption>
            )}
        </figure>
    )

}