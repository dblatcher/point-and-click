import { useAssets } from "@/context/asset-context";
import { ActorData } from "@/definitions";
import { useRoomRender } from "@/hooks/useRoomRender";
import { getBackgroundStyle } from "@/lib/image-frame-backgrounds";
import { calculateScreenX } from "@/lib/roomFunctions";
import { ImageAsset } from "@/services/assets";
import { CSSProperties, FunctionComponent, MouseEventHandler } from "react";
import { HandleHoverFunction } from "../game/types";


interface Props {
    x: number;
    y: number;
    height?: number;
    width?: number;
    filter?: string;
    clickHandler?: MouseEventHandler<SVGElement>;
    handleHover?: HandleHoverFunction;
    actorData: ActorData;
    status?: string;
}

type AssetAndFrame = {
    asset: ImageAsset,
    frame: { row: number, col: number }
};

const getPlaceholderStyle = (filter?: string): CSSProperties => {
    return {
        backgroundImage: 'repeating-linear-gradient(45deg, yellow 0px, yellow 5px, transparent 5px, transparent 10px )',
        width: '100%',
        height: '100%',
        filter,
    }
}

const getAssetAndFrame = (
    actorData: ActorData,
    getAsset: { (id: string): ImageAsset | undefined }
): AssetAndFrame | undefined => {
    const { defaultFrame, status, statusFrames } = actorData
    const frameForStatus = status ? statusFrames?.[status] : undefined
    const frameToUse = frameForStatus ?? defaultFrame;
    if (!frameToUse) {
        return undefined
    }

    const asset = getAsset?.(frameToUse.imageId)
    if (!asset) {
        return undefined
    }
    const { row = 0, col = 0 } = frameToUse
    return ({ asset, frame: { row, col } })
}


const FrameContents = (props: {
    actorData: ActorData,
    widthAdjustedByScale: number,
    heightAdjustedByScale: number,
    filter?: string,
    assetAndFrame?: AssetAndFrame,
}) => {
    const { actorData, widthAdjustedByScale, heightAdjustedByScale, filter, assetAndFrame } = props
    const divStyle = assetAndFrame
        ? getBackgroundStyle(
            // defaulting cols and rows (optional) to 1 so single frame assets are styled
            // to fill the container, not be contained at natural dims.
            { ...assetAndFrame.asset, cols: assetAndFrame.asset.cols || 1, rows: assetAndFrame.asset.rows || 1 },
            assetAndFrame.frame.col,
            assetAndFrame.frame.row,
            filter
        )
        : getPlaceholderStyle(filter)


    return <foreignObject x="0" y="0" width={widthAdjustedByScale} height={heightAdjustedByScale}>
        <div style={divStyle}>
            {!assetAndFrame &&
                <span style={{
                    fontSize: 10
                }}>{actorData.id}</span>
            }
        </div>
    </foreignObject>
}


export const FrameShape: FunctionComponent<Props> = ({
    x, y, height = 50, width = 50, filter,
    clickHandler, handleHover, actorData, status,
}: Props) => {
    const {roomData, viewAngleX, plotSurfaceY} = useRoomRender()
    const { getImageAsset } = useAssets()
    const assetAndFrame = getAssetAndFrame(actorData, getImageAsset)
    const { widthScale = 1, heightScale = 1 } = assetAndFrame?.asset ?? {};
    const widthAdjustedByScale = width * widthScale
    const heightAdjustedByScale = height * heightScale

    const svgStyle: CSSProperties = {
        overflow: 'hidden',
        pointerEvents: clickHandler ? 'auto' : 'none'
    }
    const shouldReportHover = !!(handleHover && actorData);
    const onMouseEnter = shouldReportHover ? (): void => { handleHover(actorData, 'enter') } : undefined
    const onMouseLeave = shouldReportHover ? (): void => { handleHover(actorData, 'leave') } : undefined

    return (
        <svg data-status={status}
            onClick={clickHandler}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={svgStyle}
            x={calculateScreenX(x - (widthAdjustedByScale / 2), viewAngleX, roomData)}
            y={plotSurfaceY(y + heightAdjustedByScale)} >
            <FrameContents {...{
                assetAndFrame,
                actorData,
                filter,
                widthAdjustedByScale,
                heightAdjustedByScale
            }} />
        </svg>
    )
}