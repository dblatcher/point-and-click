import { FunctionalComponent, h, JSX } from "preact";
import { SpriteFrame } from "src";
import imageService from "../../../services/imageService";


interface Props {
    width: number;
    height: number;
    backgroundColor?: string;
    frame: SpriteFrame;
}

export const FramePreview: FunctionalComponent<Props> = ({
    width, height, backgroundColor, frame
}: Props) => {

    const divStyle: JSX.CSSProperties = {
        width, height, backgroundColor
    }
    const figureStyle: JSX.CSSProperties = {
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
