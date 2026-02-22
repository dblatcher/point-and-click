import { getAspectRatioStyle, getBackgroundStyle } from "@/lib/image-frame-backgrounds";
import { GameDataContext } from "point-click-components";
import { AspectRatio, SpriteFrame } from "point-click-lib";
import { CSSProperties, FunctionComponent, useContext } from "react";


interface Props {
    width: number;
    height: number;
    backgroundColor?: string;
    frame: SpriteFrame;
    filter?: string
    aspectRatio?: AspectRatio;
    style?: CSSProperties;
}

export const BoardPicture: FunctionComponent<Props> = ({
    width, height, backgroundColor, frame, filter, aspectRatio, style
}: Props) => {
    const { getImageAsset } = useContext(GameDataContext)
    const imageAsset = getImageAsset(frame.imageId)
    const divStyle: CSSProperties = {
        width, height,
        ...style,
        backgroundColor
    }
    const fitHeight = aspectRatio ? height / aspectRatio.y < width / aspectRatio.x : undefined
    return (
        <div style={divStyle}>
            {imageAsset ? (
                <figure role="img" style={getAspectRatioStyle(aspectRatio, fitHeight)}>
                    <div style={{
                        ...getBackgroundStyle(imageAsset, frame.col, frame.row, filter),
                    }}>
                    </div>
                </figure>
            ) : <span style={{ backgroundColor: 'red', color: 'white' }}>
                missing asset {frame.imageId}
            </span>}
        </div>
    )
}
