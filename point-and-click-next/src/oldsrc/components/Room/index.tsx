import { CSSProperties, FunctionComponent, MouseEventHandler, ReactNode, useEffect, useRef, useState } from "react";
import { CellMatrix } from "../../lib/pathfinding/cells";
import { RoomData, HotspotZone } from "../../";
import { getShift } from "../../lib/roomFunctions";
import styles from './styles.module.css';
import Hotspot from "./HotSpot";
import ZoneSvg from "../ZoneSvg";
import ObstacleCellOverlay from "./ObstableCellOverlay";
import BackgroundShape from "./BackgroundShape";
import { HandleHoverFunction, RoomContentItem } from "../Game";
import { ActorFigure } from "../ActorFigure";
import { DialogueBubble } from "../DialogueBubble";

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
    flashHotspot?: number;
    markObstacleVertices?: number[];
    markWalkableVertices?: number[];
    showCaption?: boolean;
    isPaused?: boolean;
    contents?: RoomContentItem[];
    children?: ReactNode;
    forPreview?: boolean;
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
    markHotspotVertices = [],
    flashHotspot,
    markObstacleVertices = [],
    markWalkableVertices = [],
    showCaption = false,
    isPaused = false,
    contents = [],
    forPreview = false,
    children,
}: Props) => {
    const { id, frameWidth, height, background, hotspots = [], obstacleAreas = [], walkableAreas = [] } = data;
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

    const processRoomClick: MouseEventHandler<HTMLElement> = (event) => {
        return handleRoomClick(event.nativeEvent.offsetX / scale, event.nativeEvent.offsetY / scale)
    }

    const figureInlineStyle: CSSProperties = {
        width: `${frameWidth * scale}px`,
        height: `${height * scale}px`,
        position: 'relative',
        margin: forPreview ? 0 : undefined,
    }

    return (
        <figure ref={figureRef}
            className={styles.roomFigure}
            style={figureInlineStyle}
            onClick={processRoomClick}
        >

            <svg xmlns="http://www.w3.org/2000/svg"
                className={styles.roomSvg}
                viewBox={`0 0 ${frameWidth} ${height}`}>

                {background
                    .filter(layer => layer.parallax <= 1)
                    .map((layer, index) =>
                        <BackgroundShape key={index}
                            layer={layer}
                            viewAngle={viewAngle}
                            roomData={data}
                        />
                    )}

                {showObstacleAreas && walkableAreas.map((zone, index) => {
                    const center = (frameWidth / 2) + getShift(viewAngle, 1, data)
                    const left = center - data.width / 2
                    const classes = zone.disabled ? [styles.walkableArea, styles.disabledZone].join(" ") : styles.walkableArea;
                    return <ZoneSvg key={index}
                        className={classes}
                        stopPropagation={false}
                        zone={zone}
                        x={zone.x + left}
                        y={data.height - zone.y}
                        markVertices={markWalkableVertices.includes(index)}
                    />
                })}

                {showObstacleAreas && obstacleAreas.map((zone, index) => {
                    const center = (frameWidth / 2) + getShift(viewAngle, 1, data)
                    const left = center - data.width / 2
                    const classes = zone.disabled ? [styles.obstacleArea, styles.disabledZone].join(" ") : styles.obstacleArea;
                    return <ZoneSvg key={index}
                        className={classes}
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
                        flash={flashHotspot === index}
                    />
                )}

                {contents.map(entry => (
                    <ActorFigure key={entry.data.id}
                        isPaused={isPaused}
                        forPreview={forPreview}
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

                {background
                    .filter(layer => layer.parallax > 1)
                    .map((layer, index) =>
                        <BackgroundShape key={index}
                            layer={layer}
                            viewAngle={viewAngle}
                            roomData={data}
                        />
                    )}

                {contents.map(entry => (
                    <DialogueBubble key={entry.data.id}
                        actorData={entry.data}
                        orders={entry.orders || []}
                        viewAngle={viewAngle}
                        roomData={data} roomScale={scale} />
                ))}

                {children}
            </svg>

            {showCaption && (
                <figcaption className={styles.roomCaption}>{id}</figcaption>
            )}
        </figure>
    )

}