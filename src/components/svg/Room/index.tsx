import { ActorFigure } from "@/components/svg/ActorFigure";
import { DialogueBubble } from "@/components/svg/DialogueBubble";
import ZoneSvg from "@/components/svg/ZoneSvg";
import { HotspotZone, RoomData } from "@/definitions";
import { CellMatrix } from "@/lib/pathfinding/cells";
import { getShift } from "@/lib/roomFunctions";
import { CSSProperties, FunctionComponent, MouseEventHandler, ReactNode } from "react";
import { HandleHoverFunction, RoomContentItem } from "../../game/types";
import BackgroundShape from "./BackgroundShape";
import Hotspot from "./HotSpot";
import ObstacleCellOverlay from "./ObstableCellOverlay";
import styles from './styles.module.css';
import { obstableClassNames, walkableClassNames } from "./zoneCssClasses";

interface Props {
    data: RoomData;
    maxWidth?: number;
    maxHeight?: number;
    viewAngleX: number;
    viewAngleY?: number;
    handleRoomClick: { (x: number, y: number): void };
    handleRoomContextClick?: { (x: number, y: number): void };
    handleHotspotClick?: { (zone: HotspotZone, event: PointerEvent): void };
    handleHotspotContextClick?: { (zone: HotspotZone, event: PointerEvent): void };
    handleHover?: HandleHoverFunction;
    renderAllZones?: boolean;
    highlightHotspots?: boolean;
    obstacleCells?: CellMatrix;
    markHotspotVertices?: number[];
    markObstacleVertices?: number[];
    markWalkableVertices?: number[];
    showCaption?: boolean;
    isPaused?: boolean;
    contents?: RoomContentItem[];
    noSound?: boolean;
    noMargin?: boolean;
    fontFamily?: string;
    children?: ReactNode;

}

export const Room: FunctionComponent<Props> = ({
    data,
    maxWidth = 300,
    maxHeight = 200,
    viewAngleX,
    handleRoomClick,
    handleRoomContextClick,
    handleHotspotClick,
    handleHotspotContextClick,
    handleHover,
    renderAllZones: renderAllZones,
    highlightHotspots,
    obstacleCells,
    markHotspotVertices = [],
    markObstacleVertices = [],
    markWalkableVertices = [],
    showCaption = false,
    isPaused = false,
    contents = [],
    noSound = false,
    noMargin = false,
    fontFamily,
    children,
}: Props) => {
    const { id, frameWidth, height, background, hotspots = [], obstacleAreas = [], walkableAreas = [], frameHeight = height } = data;

    const scale = Math.min(
        maxWidth / frameWidth,
        maxHeight / frameHeight
    )

    const processRoomClick: MouseEventHandler<HTMLElement> = (event) => {
        return handleRoomClick(event.nativeEvent.offsetX / scale, event.nativeEvent.offsetY / scale)
    }
    const processRoomContextClick: MouseEventHandler<HTMLElement> = (event) => {
        if (!handleHotspotContextClick) {
            return
        }
        event.preventDefault();
        return handleRoomContextClick?.(event.nativeEvent.offsetX / scale, event.nativeEvent.offsetY / scale);
    }

    const figureInlineStyle: CSSProperties = {
        width: `${frameWidth * scale}px`,
        height: `${frameHeight * scale}px`,
        margin: noMargin ? 0 : undefined,
        backgroundColor: data.backgroundColor,
    }

    const center = (frameWidth / 2) + getShift(viewAngleX, 1, data)
    const left = center - data.width / 2

    return (
        <figure
            className={styles.roomFigure}
            style={figureInlineStyle}
            onClick={processRoomClick}
            onContextMenu={processRoomContextClick}
        >
            <svg xmlns="http://www.w3.org/2000/svg"
                className={styles.roomSvg}
                viewBox={`0 0 ${frameWidth} ${frameHeight}`}>

                {background
                    .filter(layer => layer.parallax <= 1)
                    .map((layer, index) =>
                        <BackgroundShape key={index}
                            layer={layer}
                            viewAngleX={viewAngleX}
                            roomData={data}
                        />
                    )}

                {obstacleCells &&
                    <ObstacleCellOverlay roomData={data} viewAngleX={viewAngleX} cellMatrix={obstacleCells} />
                }

                {hotspots.map((zone, index) =>
                    <Hotspot key={index}
                        zone={zone}
                        viewAngleX={viewAngleX}
                        roomData={data}
                        highlight={highlightHotspots}
                        clickHandler={handleHotspotClick}
                        contextClickHandler={handleHotspotContextClick}
                        stopPropogation={!!handleHotspotClick}
                        handleHover={handleHover}
                        markVertices={markHotspotVertices.includes(index)}
                    />
                )}

                {contents.map(entry => (
                    <ActorFigure key={entry.data.id}
                        isPaused={isPaused}
                        noSound={noSound}
                        data={entry.data}
                        orders={entry.orders || []}
                        clickHandler={entry.clickHandler}
                        contextClickHandler={entry.contextClickHandler}
                        roomData={data}
                        viewAngleX={viewAngleX}
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
                            viewAngleX={viewAngleX}
                            roomData={data}
                        />
                    )}

                {contents.map(entry => (
                    <DialogueBubble key={entry.data.id}
                        actorData={entry.data}
                        orders={entry.orders || []}
                        viewAngleX={viewAngleX}
                        roomData={data} roomScale={scale}
                        fontFamily={fontFamily}
                    />
                ))}

                {walkableAreas.map((zone, index) => {
                    if (!renderAllZones && !markWalkableVertices.includes(index)) {
                        return null
                    }
                    return <ZoneSvg key={index}
                        className={walkableClassNames({ disabled: zone.disabled })}
                        stopPropagation={false}
                        zone={zone}
                        x={zone.x + left}
                        y={data.height - zone.y}
                        markVertices={markWalkableVertices.includes(index)}
                    />
                })}

                {obstacleAreas.map((zone, index) => {
                    if (!renderAllZones && !markObstacleVertices.includes(index)) {
                        return null
                    }
                    return <ZoneSvg key={index}
                        className={obstableClassNames({ disabled: zone.disabled })}
                        stopPropagation={false}
                        zone={zone}
                        x={zone.x + left}
                        y={data.height - zone.y}
                        markVertices={markObstacleVertices.includes(index)}
                    />
                })}

                {children}
            </svg>

            {showCaption && (
                <figcaption className={styles.roomCaption}>{id}</figcaption>
            )}
        </figure>
    )

}