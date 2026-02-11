import { useAssets } from "@/context/asset-context";
import { useGameDesign } from "@/context/game-design-context";
import { Box } from "@mui/material";
import { ActorData, Direction, SpriteData } from "point-click-lib";
import { ActorPreview } from "point-click-components";

type Props = {
    data: ActorData;
    overrideSpriteData?: SpriteData;
    scale?: number;
    noBaseLine?: boolean;
    maxHeight?: number;
    animation?: string;
    direction?: Direction;
}


export const SpritePreview = (props: Props) => {
    const { gameDesign } = useGameDesign()
    const { getImageAsset } = useAssets()

    return (
        <Box
            sx={{
                margin: 0,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <ActorPreview
                {...props}
                sprites={gameDesign.sprites}
                getImageAsset={getImageAsset}
            />
        </Box>
    )
}

