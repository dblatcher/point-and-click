import { FunctionComponent, CSSProperties } from "react";
import { SpriteFrame } from "../../../";
import imageService from "@/services/imageService";


interface Props {
    width: number;
    height: number;
    backgroundColor?: string;
    frame: SpriteFrame;
}

export const FramePreview: FunctionComponent<Props> = ({
    width, height, backgroundColor, frame
}: Props) => {

    const divStyle: CSSProperties = {
        width, height, backgroundColor
    }
    const figureStyle: CSSProperties = {
        width: '100%',
        height: '100%',
    }

    const image = imageService.get(frame.imageId)
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
