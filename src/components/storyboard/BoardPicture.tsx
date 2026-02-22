import { getAspectRatioStyle, getBackgroundStyle } from "@/lib/image-frame-backgrounds";
import { ImageAsset } from "@/services/assets";
import { AspectRatio, SpriteFrame } from "point-click-lib";
import { CSSProperties, FunctionComponent } from "react";


interface Props {
    backgroundColor?: string;
    frame: SpriteFrame;
    filter?: string
    aspectRatio?: AspectRatio;
    style?: CSSProperties;
    getImageAsset: { (id: string): ImageAsset | undefined }
}

export const BoardPicture: FunctionComponent<Props> = ({
    backgroundColor, frame, filter, aspectRatio, style, getImageAsset
}: Props) => {
    const imageAsset = getImageAsset(frame.imageId)
    const divStyle: CSSProperties = {
        ...style,
        backgroundColor
    }
    const fitHeight = aspectRatio ? 1 / aspectRatio.y < 1 / aspectRatio.x : undefined
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
