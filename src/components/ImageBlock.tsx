import { useAssets } from "@/context/asset-context";
import { AspectRatio, StaticFrameParamsS } from "@/definitions/BaseTypes";
import { getBackgroundStyle } from "@/lib/image-frame-backgrounds";
import React from "react";

interface Props {
    frame: StaticFrameParamsS,
    aspectRatio?: AspectRatio,
    filter?: string,
    fitHeight?: boolean,
}


const getAspectRatioStyle = (aspectRatio?: AspectRatio, fitHeight = false) => {
    return !aspectRatio ? {
        height: '100%',
        width: '100%',
        margin: 0,
    } : fitHeight ? {
        height: '100%',
        width: 'auto',
        aspectRatio: `${aspectRatio.x}/${aspectRatio.y}`,
        margin: 0,
    } : {
        height: 'auto',
        width: '100%',
        aspectRatio: `${aspectRatio.x}/${aspectRatio.y}`,
        margin: 0,
    }
}

/**
 * Renders a figure with the aspect ratio scaled to be contained by its parent, with the sprite
 * frame as its image background.
 * 
 * If the frame has no row and col specified, the image background will display at the image's
 * natural aspect ratio, not be stretch to fill the figure.
 */
export const ImageBlock: React.FunctionComponent<Props> = ({ frame, aspectRatio, filter, fitHeight }) => {
    const { getImageAsset } = useAssets()
    const asset = getImageAsset(frame.imageId)
    if (!asset) {
        return null
    }

    return <figure role="img" style={getAspectRatioStyle(aspectRatio, fitHeight)}>
        <div style={{
            ...getBackgroundStyle(asset, frame.col, frame.row, filter),
        }}>
        </div>
    </figure>

}
