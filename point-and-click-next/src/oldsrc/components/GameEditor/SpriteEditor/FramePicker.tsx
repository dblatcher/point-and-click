import { FunctionComponent, MouseEventHandler } from "react";

import imageService from "../../../../services/imageService";

import { ServiceItemSelector } from "../ServiceItemSelector";
import { SpriteSheetPreview } from "../SpriteSheetPreview";

interface Props {
    row: number;
    col: number;
    sheetId?: string;
    pickFrame: { (row: number, col: number, sheetId?: string): void };
    fixedSheet?: boolean;
}

export const FramePicker: FunctionComponent<Props> = ({ row, col, sheetId, pickFrame, fixedSheet = false }) => {

    const image = sheetId ? imageService.get(sheetId) : undefined;
    const handleClick:MouseEventHandler<HTMLCanvasElement> = (event): void => {
        if (!image) { return }
        const { cols = 1, rows = 1 } = image
        const { offsetX, offsetY } = event.nativeEvent
        const { clientWidth, clientHeight } = event.target as HTMLCanvasElement;
        const newCol = Math.floor(cols * (offsetX / clientWidth))
        const newRow = Math.floor(rows * (offsetY / clientHeight))
        pickFrame(newRow, newCol, sheetId)
    }

    return (<>
        {!fixedSheet && (
            <ServiceItemSelector legend="pick sheet"
                format="select"
                service={imageService}
                selectedItemId={sheetId}
                select={(item): void => { pickFrame(0, 0, item.id) }} />
        )}

        {image && (<>
            <SpriteSheetPreview
                imageAsset={image}
                highlight={{ row, col }}
                canvasScale={300}
                handleClick={handleClick} />
            <span>{sheetId} [ <span>{col}</span>,<span>{row}</span> ]</span>
        </>)}
    </>
    )
}