import { FunctionalComponent, h, JSX } from "preact";
import { SpriteFrame } from "../../../definitions/SpriteSheet";
import imageService from "../../../services/imageService";
import spriteSheetService from "../../../services/spriteSheetService";


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

    const sheet = spriteSheetService.get(frame.sheetId)
    if (sheet) {
        const url = imageService.get(sheet.imageId)?.href
        Object.assign(figureStyle, {
            backgroundImage: `url(${url})`,
            backgroundPositionX: `${-100 * frame.col}%`,
            backgroundPositionY: `${-100 * frame.row}%`,
            backgroundSize: `${100 * sheet.cols}% ${100 * sheet.rows}%`,
        })
    }

    return (
        <div style={divStyle}>
            <figure style={figureStyle} />
        </div>
    )
}
