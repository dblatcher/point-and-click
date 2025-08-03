import { FunctionComponent, CSSProperties } from "react";
import { SpriteFrame } from "@/definitions";
import { ImageBlock } from "@/components/ImageBlock";
import { AspectRatio } from "@/definitions/BaseTypes";


interface Props {
    width: number;
    height: number;
    backgroundColor?: string;
    frame: SpriteFrame;
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
            <ImageBlock frame={frame} filter={filter} aspectRatio={aspectRatio} fitHeight={fitHeight} />
        </div>
    )
}
