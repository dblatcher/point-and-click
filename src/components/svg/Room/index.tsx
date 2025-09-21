import { ActorFigure } from "@/components/svg/ActorFigure";
import { DialogueBubble } from "@/components/svg/DialogueBubble";
import { RoomRenderContext } from "@/context/room-render-context";
import { HotspotZone, RoomData } from "@/definitions";
import { CellMatrix } from "@/lib/pathfinding/cells";
import { CSSProperties, FunctionComponent, MouseEventHandler, ReactNode } from "react";
import { HandleHoverFunction, RoomContentItem } from "../../game/types";
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
                {/* Background layers */}
                <ParallaxFrame>
                    {background
                        .filter(layer => layer.parallax <= 1)
                        .map((layer, index) =>
                            <BackgroundShape key={index} layer={layer} />
                        )}
                    {obstacleCells &&
                        <ObstacleCellOverlay cellMatrix={obstacleCells} />
                    }
                </ParallaxFrame>

                <ParallaxFrame interactive>
                    {hotspots.map((zone, index) =>
                        <Hotspot key={index}
                            zone={zone}
                            highlight={highlightHotspots}
                            clickHandler={handleHotspotClick}
                            contextClickHandler={handleHotspotContextClick}
                            stopPropogation={!!handleHotspotClick}
                            handleHover={handleHover}
                            markVertices={markHotspotVertices.includes(index)}
                        />
                    )}
                </ParallaxFrame>

                <SurfaceFrame>
                    {contents.map(entry => (
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

                {/* Foreground and overlays*/}
                <ParallaxFrame>
                    {background
                        .filter(layer => layer.parallax > 1)
                        .map((layer, index) =>
                            <BackgroundShape key={index} layer={layer} />
                        )}

                    {walkableAreas.map((zone, index) => {
                        if (!renderAllZones && !markWalkableVertices.includes(index)) {
                            return null
                        }
                        return <WalkableOrObstacle key={index}
                            zone={zone}
                            markVertices={markWalkableVertices.includes(index)}
                            zoneType="walkable"
                            zoneOptions={{ disabled: zone.disabled }}
                        />
                    })}

                    {obstacleAreas.map((zone, index) => {
                        if (!renderAllZones && !markObstacleVertices.includes(index)) {
                            return null
                        }
                        return <WalkableOrObstacle key={index}
                            zone={zone}
                            markVertices={markObstacleVertices.includes(index)}
                            zoneType="obstacle"
                            zoneOptions={{ disabled: zone.disabled }}
                        />
                    })}
                </ParallaxFrame>

                <ParallaxFrame>{children}</ParallaxFrame>

                <SurfaceFrame>
                    {surfaceContent}
                    {contents.map(entry => (
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
