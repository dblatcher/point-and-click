import { ImageBlock } from "@/components/ImageBlock";
import { SpriteFrame } from "@/definitions";
import { AspectRatio } from "@/definitions/BaseTypes";
import { CSSProperties, FunctionComponent } from "react";
import { HideImageOutlinedIcon } from "./material-icons";


interface Props {
    width: number;
    height: number;
    backgroundColor?: string;
    frame?: SpriteFrame;
    filter?: string
    aspectRatio?: AspectRatio;
    style?: CSSProperties;
}

export const FramePreview: FunctionComponent<Props> = ({
    width, height, backgroundColor, frame, filter, aspectRatio, style
}: Props) => {
    const divStyle: CSSProperties = {
        width, height,
        ...style,
        backgroundColor
    }
    const fitHeight = aspectRatio ? height / aspectRatio.y < width / aspectRatio.x : undefined
    return (
        <div style={divStyle}>
            {(frame && frame.imageId) ? (
                <ImageBlock frame={frame} filter={filter} aspectRatio={aspectRatio} fitHeight={fitHeight} />
            ) : (
                <div style={{
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <HideImageOutlinedIcon sx={{ height: Math.min(50, height - 10), width: Math.min(50, width - 10) }} />
                </div>
            )}
        </div>
    )
}
