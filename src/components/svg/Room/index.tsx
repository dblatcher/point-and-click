import { ActorFigure } from "@/components/svg/ActorFigure";
import { DialogueBubble } from "@/components/svg/DialogueBubble";
import { RoomRenderContext } from "@/context/room-render-context";
import { HotspotZone, RoomData } from "point-click-lib";
import { CellMatrix } from "@/lib/pathfinding";
import { CSSProperties, FunctionComponent, MouseEventHandler, ReactNode } from "react";
import { HandleHoverFunction, ActorWithOrdersAndClickHandlers } from "../../game/types";
import BackgroundShape from "./BackgroundShape";
import Hotspot from "./HotSpot";
import ObstacleCellOverlay from "./ObstableCellOverlay";
import { ParallaxFrame } from "./ParallaxFrame";
import styles from './styles.module.css';
import { SurfaceFrame } from "./SurfaceFrame";
import { WalkableOrObstacle } from "./WalkableOrObstance";

interface Props {
    data: RoomData;
    maxWidth?: number;
    maxHeight?: number;
    viewAngleX: number;
    viewAngleY: number;
    handleRoomClick: { (x: number, y: number): void };
    handleRoomContextClick?: { (x: number, y: number): void };
    handleHotspotClick?: { (zone: HotspotZone, event: PointerEvent): void };
    handleHotspotContextClick?: { (zone: HotspotZone, event: PointerEvent): void };
    handleHover?: HandleHoverFunction;
    renderAllZones?: boolean;
    highlightHotspots?: boolean;
    obstacleCells?: CellMatrix;
    hotspotIndexToMark?: number;
    obstacleIndexToMark?: number;
    walkableIndexToMark?: number;
    showCaption?: boolean;
    isPaused?: boolean;
    orderedActors?: ActorWithOrdersAndClickHandlers[];
    noSound?: boolean;
    noMargin?: boolean;
    fontFamily?: string;
    parallaxContent?: ReactNode;
    surfaceContent?: ReactNode;
}

export const Room: FunctionComponent<Props> = ({
    data,
    maxWidth = 300,
    maxHeight = 200,
    viewAngleX,
    viewAngleY,
    handleRoomClick,
    handleRoomContextClick,
    handleHotspotClick,
    handleHotspotContextClick,
    handleHover,
    renderAllZones,
    highlightHotspots,
    obstacleCells,
    hotspotIndexToMark,
    obstacleIndexToMark,
    walkableIndexToMark,
    showCaption = false,
    isPaused = false,
    orderedActors = [],
    noSound = false,
    noMargin = false,
    fontFamily,
    parallaxContent,
    surfaceContent,
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

    return (
        <RoomRenderContext.Provider value={{
            roomData: data,
            viewAngleX,
            viewAngleY,
            scale,
        }}>
            <figure
                className={styles.roomFigure}
                style={figureInlineStyle}
                onClick={processRoomClick}
                onContextMenu={processRoomContextClick}
            >
                <ParallaxFrame>
                    {background
                        .filter(layer => layer.parallax <= 1)
                        .map((layer, index) =>
                            <BackgroundShape key={index} layer={layer} />
                        )}
                    {obstacleCells &&
                        <ObstacleCellOverlay cellMatrix={obstacleCells} />
                    }
                    {hotspots.map((zone, index) =>
                        <Hotspot key={index}
                            zone={zone}
                            highlight={highlightHotspots}
                            clickHandler={handleHotspotClick}
                            contextClickHandler={handleHotspotContextClick}
                            stopPropogation={!!handleHotspotClick}
                            handleHover={handleHover}
                            markVertices={hotspotIndexToMark === index}
                        />
                    )}
                </ParallaxFrame>

                <SurfaceFrame>
                    {orderedActors.map(entry => (
                        <ActorFigure key={entry.data.id}
                            isPaused={isPaused}
                            noSound={noSound}
                            data={entry.data}
                            orders={entry.orders || []}
                            clickHandler={entry.clickHandler}
                            contextClickHandler={entry.contextClickHandler}
                            roomScale={scale}
                            handleHover={handleHover}
                            overrideSprite={entry.overrideSprite}
                        />
                    ))}
                </SurfaceFrame>

                <ParallaxFrame>
                    {background
                        .filter(layer => layer.parallax > 1)
                        .map((layer, index) =>
                            <BackgroundShape key={index} layer={layer} />
                        )}

                    {walkableAreas.map((zone, index) => {
                        if (!renderAllZones && walkableIndexToMark !== index) {
                            return null
                        }
                        return <WalkableOrObstacle key={index}
                            zone={zone}
                            markVertices={walkableIndexToMark == index}
                            zoneType="walkable"
                            zoneOptions={{ disabled: zone.disabled }}
                        />
                    })}

                    {obstacleAreas.map((zone, index) => {
                        if (!renderAllZones && obstacleIndexToMark !== index) {
                            return null
                        }
                        return <WalkableOrObstacle key={index}
                            zone={zone}
                            markVertices={obstacleIndexToMark === index}
                            zoneType="obstacle"
                            zoneOptions={{ disabled: zone.disabled }}
                        />
                    })}
                    {parallaxContent}
                </ParallaxFrame>

                <SurfaceFrame>
                    {surfaceContent}
                    {orderedActors.map(entry => (
                        <DialogueBubble key={entry.data.id}
                            actorData={entry.data}
                            orders={entry.orders || []}
                            roomScale={scale}
                            fontFamily={fontFamily}
                        />
                    ))}
                </SurfaceFrame>

                {showCaption && (
                    <figcaption className={styles.roomCaption}>{id}</figcaption>
                )}
            </figure>
        </RoomRenderContext.Provider>
    )
}
