import { h, ComponentChildren, FunctionComponent } from "preact";
import { CellMatrix } from "../../lib/pathfinding/cells";
import { RoomData } from "src";
import { HotspotZone } from "src";
import { getShift } from "../../lib/util";
import styles from './styles.module.css';
import Hotspot from "./Hotspot";
import ZoneSvg from "../ZoneSvg";
import ObstacleCellOverlay from "./ObstableCellOverlay";
import BackgroundShape from "./BackgroundShape";
import { HandleHoverFunction, RoomContentItem } from "../Game";
import { CharacterFigure } from "../CharacterFigure";
import { useEffect, useRef, useState } from "preact/hooks";

interface Props {
    data: RoomData;
    maxWidth?: number;
    maxHeight?: number;
    noResize?: boolean;
    viewAngle: number;
    handleRoomClick: { (x: number, y: number): void };
    handleHotspotClick?: { (zone: HotspotZone): void };
    handleHover?: HandleHoverFunction;
    showObstacleAreas?: boolean;
    highlightHotspots?: boolean;
    obstacleCells?: CellMatrix;
    markHotspotVertices?: number[];
    markObstacleVertices?: number[];
    showCaption?: boolean;
    isPaused?: boolean;
    contents?: RoomContentItem[];
    children?: ComponentChildren;
}

export const Room: FunctionComponent<Props> = ({
    data,
    maxWidth = 300,
    maxHeight = 200,
    noResize,
    viewAngle,
    handleRoomClick,
    handleHotspotClick,
    handleHover,
    showObstacleAreas,
    highlightHotspots,
    obstacleCells,
    markHotspotVertices =[],
    markObstacleVertices =[],
    showCaption = false,
    isPaused = false,
    contents =[],
    children,
}: Props) => {
    const { id, frameWidth, height, background, hotspots = [], obstacleAreas = [] } = data;
    const figureRef = useRef<HTMLElement>(null)
    const [parentWidth, setParentWidth] = useState(Infinity)
    const [parentHeight, setParentHeight] = useState(Infinity)

    const handleResize = (): void => {
        const { current: figure } = figureRef
        if (noResize) {
            setParentWidth(Infinity)
            setParentHeight(Infinity)
            return
        }
        if (!figure || !figure.parentElement) {
            return
        }
        setParentWidth(figure.parentElement.clientWidth)
        setParentHeight(figure.parentElement.clientHeight)
    }
    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)
        return (): void => {
            window.removeEventListener('resize', handleResize)
        }
    })

    const figureWidth = Math.min(parentWidth, maxWidth)
    const figureHeight = Math.min(parentHeight, maxHeight)
    const scale = Math.min(figureWidth / frameWidth, figureHeight / height)

    const processRoomClick = (event: MouseEvent): void => {
        return handleRoomClick(event.offsetX / scale, event.offsetY / scale)
    }

    return (
        <figure ref={figureRef}
            className={styles.roomFigure}
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

                {contents.map(entry => (
                    <CharacterFigure key={entry.data.id}
                        isPaused={isPaused}
                        data={entry.data}
                        orders={entry.orders || []}
                        clickHandler={entry.clickHandler}
                        roomData={data}
                        viewAngle={viewAngle}
                        roomScale={scale}
                        handleHover={handleHover}
                        overrideSprite={entry.overrideSprite}
                    />
                ))}

                {children}
            </svg>

            {showCaption && (
                <figcaption className={styles.roomCaption}>{id}</figcaption>
            )}
        </figure>
    )

}