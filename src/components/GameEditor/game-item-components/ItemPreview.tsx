import { useAssets } from "@/context/asset-context";
import { useSprites } from "@/context/sprite-context";
import { buildActorData } from "@/lib/sprite-to-actor";
import { findById } from "@/lib/util";
import { Box, BoxProps } from "@mui/material";
import { StoryPageDisplay } from "point-click-components";
import { ActorData, GameDataItem, GameDataItemType, ItemData, RoomData, SpriteData, StoryBoard } from "point-click-lib";
import { FramePreview } from "../FramePreview";
import { HideImageOutlinedIcon } from "../material-icons";
import { RoomLocationPicker } from "../RoomLocationPicker";
import { SpritePreview } from "../SpritePreview";

const PREVIEW_WIDTH = 100
const PREVIEW_HEIGHT = 80

const previewBoxProps: BoxProps = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}

export const ItemPreview = ({
    item,
    designProperty,
    width = PREVIEW_WIDTH,
    height = PREVIEW_HEIGHT,
}: {
    item: GameDataItem;
    designProperty: GameDataItemType;
    width?: number;
    height?: number;
}) => {
    const { getImageAsset } = useAssets()
    const sprites = useSprites();
    if (designProperty === 'rooms') {
        const roomData = item as RoomData
        return <Box {...previewBoxProps} width={width}>
            <RoomLocationPicker
                roomData={roomData}
                previewHeight={height}
                fixedView={{ x: 0, y: 0 }}
                previewWidth={width} />
        </Box>
    }
    if (designProperty === 'actors') {
        const actorData = item as ActorData
        return <Box {...previewBoxProps}>
            <SpritePreview data={actorData} animation='default' noBaseLine maxHeight={height} />
        </Box>
    }
    if (designProperty === 'sprites') {
        const spriteData = item as SpriteData;
        const sprite = findById(spriteData.id, sprites);
        return <Box {...previewBoxProps}>
            {sprite &&
                <SpritePreview
                    data={buildActorData(sprite, 'default', spriteData.defaultDirection)}
                    animation='default' noBaseLine maxHeight={height}
                    overrideSpriteData={spriteData}
                />
            }
        </Box>

    }
    if (designProperty === 'items') {
        const { imageId, row = 0, col = 0 } = item as ItemData
        return <Box {...previewBoxProps}>
            <FramePreview frame={imageId ? { imageId, row, col } : undefined} height={80} width={80} />
        </Box>
    }
    if (designProperty === 'storyBoards') {
        const { font, pages } = item as StoryBoard;
        const [firstPage] = pages
        return <Box {...previewBoxProps} flexDirection={'column'} alignItems={'stretch'} fontSize={3}>
            {firstPage
                ? <StoryPageDisplay page={firstPage} font={font} getImageAsset={getImageAsset} />
                : <HideImageOutlinedIcon sx={{ height: 50, width: 50 }} />
            }
        </Box>
    }
    return null
}