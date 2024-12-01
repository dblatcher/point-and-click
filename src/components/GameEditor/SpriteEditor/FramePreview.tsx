import { FunctionComponent, CSSProperties } from "react";
import { SpriteFrame } from "@/definitions";
import { ImageBlock } from "@/components/ImageBlock";


interface Props {
    width: number;
    height: number;
    backgroundColor?: string;
    frame: SpriteFrame;
    filter?: string
}

export const FramePreview: FunctionComponent<Props> = ({
    width, height, backgroundColor, frame, filter
}: Props) => {
    const divStyle: CSSProperties = {
        width, height, backgroundColor
    }

    return (
        <div style={divStyle}>
            <ImageBlock frame={frame} filter={filter} />
        </div>
    )
}
