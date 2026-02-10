import { ImageAsset } from "@/services/assets";
import { ActorFigure, RoomRenderContext, SurfaceFrame } from "point-click-components";
import { ActorData, Direction, SpriteData } from "point-click-lib";
import HorizontalLine from "../svg/HorizontalLine";

export type ActorPreviewProps = {
    data: ActorData;
    overrideSpriteData?: SpriteData;
    scale?: number;
    noBaseLine?: boolean;
    maxHeight?: number;
    animation?: string;
    direction?: Direction;
    getImageAsset: { (id: string): ImageAsset | undefined };
    sprites: SpriteData[]
}


const getActorScale = (height: number, scale: number, maxHeight?: number) => {
    if (!maxHeight || height === 0) {
        return scale
    }
    return maxHeight / height
}

const getRoomScale = (scale: number, roomWidth: number, roomHeight: number, maxHeight?: number) => {
    const effectiveMaxWidth = maxHeight ? roomWidth : 100 * scale
    const effectiveMaxHeight = maxHeight ?? 200;
    return Math.min(
        effectiveMaxWidth / roomWidth,
        effectiveMaxHeight / roomHeight
    )
}

export const ActorPreview = ({
    data, overrideSpriteData, scale = 1, noBaseLine, maxHeight, animation, direction,
    getImageAsset, sprites,
}: ActorPreviewProps) => {

    const actorScale = getActorScale(data.height, scale, maxHeight)
    const roomWidth = actorScale * data.width;
    const roomHeight = actorScale * data.height;
    const roomScale = getRoomScale(scale, roomWidth, roomHeight, maxHeight)

    return <RoomRenderContext.Provider value={{
        roomData: {
            height: roomHeight,
            width: roomWidth,
            frameWidth: roomWidth,
            id: '',
            background: [],
        },
        viewAngleX: 0,
        viewAngleY: 0,
        scale: roomScale,
        orderSpeed: 1,
    }}>
        <figure style={{
            width: roomWidth * roomScale,
            height: roomHeight * roomScale,
            margin: 0,
        }}>
            <SurfaceFrame>
                <ActorFigure
                    isPaused={false}
                    noSound
                    data={{
                        ...data,
                        width: roomWidth,
                        height: roomHeight,
                        x: roomWidth / 2,
                        status: animation ?? data.status,
                        direction: direction ?? data.direction,
                        y: 0
                    }}
                    roomScale={roomScale}
                    overrideSpriteData={overrideSpriteData}
                    getImageAsset={getImageAsset}
                    sprites={sprites}
                />
                {!noBaseLine && (
                    <HorizontalLine y={data.baseline || 0} />
                )}
            </SurfaceFrame>
        </figure>
    </RoomRenderContext.Provider>
}


