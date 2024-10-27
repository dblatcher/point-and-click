import { FunctionComponent, CSSProperties } from "react";
import { SpriteFrame } from "@/definitions";
import { useImageAssets } from "@/context/image-asset-context";


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
    const { getAsset } = useImageAssets()
    const divStyle: CSSProperties = {
        width, height, backgroundColor
    }
    const figureStyle: CSSProperties = {
        width: '100%',
        height: '100%',
        margin: 0,
        filter,
    }

    const image = getAsset(frame.imageId)
    if (image) {
        const { href, cols = 1, rows = 1 } = image
        Object.assign(figureStyle, {
            backgroundImage: `url(${href})`,
            backgroundPositionX: `${-100 * frame.col}%`,
            backgroundPositionY: `${-100 * frame.row}%`,
            backgroundSize: `${100 * cols}% ${100 * rows}%`,
        })
    }

    return (
        <div style={divStyle}>
            <figure style={figureStyle} />
        </div>
    )
}
