import { RoomRenderContext } from "@/context/room-render-context";
import { ActorData, Direction, SpriteData } from "point-click-lib";
import { Box } from "@mui/material";
import { ActorFigure } from "../svg/ActorFigure";
import HorizontalLine from "../svg/HorizontalLine";
import { SurfaceFrame } from "../svg/Room/SurfaceFrame";
import { useAssets } from "@/context/asset-context";

type Props = {
    data: ActorData;
    overrideSpriteData?: SpriteData;
    scale?: number;
    noBaseLine?: boolean;
    maxHeight?: number;
    animation?: string;
    direction?: Direction;
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

export const SpritePreview = ({ data, overrideSpriteData, scale = 1, noBaseLine, maxHeight, animation, direction }: Props) => {

    const {getImageAsset} = useAssets()
    const actorScale = getActorScale(data.height, scale, maxHeight)
    const roomWidth = actorScale * data.width;
    const roomHeight = actorScale * data.height;
    const roomScale = getRoomScale(scale, roomWidth, roomHeight, maxHeight)

    return (
        <RoomRenderContext.Provider value={{
            roomData: {
                height: roomHeight,
                width: roomWidth,
                frameWidth: roomWidth,
                id: '',
                background: []
            },
            viewAngleX: 0,
            viewAngleY: 0,
            scale: roomScale,
        }}>
            <Box component={'figure'}
                sx={{
                    margin: 0,
                    position: 'relative',
                    overflow: 'hidden',
                }}
                style={{
                    width: roomWidth * roomScale,
                    height: roomHeight * roomScale,
                }}
            >
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
                    />
                    {!noBaseLine && (
                        <HorizontalLine y={data.baseline || 0} />
                    )}
                </SurfaceFrame>
            </Box>
        </RoomRenderContext.Provider>
    )
}

