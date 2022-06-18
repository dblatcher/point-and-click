import { FunctionalComponent, h, Fragment, JSX } from "preact";
import spriteSheetService from "../../services/spriteSheetService";
import { ServiceItemSelector } from "../ServiceItemSelector";
import { useState } from "preact/hooks";
import styles from '../editorStyles.module.css';
import { SpriteSheetPreview } from "../SpriteSheetPreview";

interface Props {
    row: number;
    col: number;
    sheetId?: string;
    pickFrame: { (row: number, col: number, sheetId?: string): void };
}

export const FramePicker: FunctionalComponent<Props> = ({ row, col, sheetId, pickFrame }) => {

    const sheet = sheetId ? spriteSheetService.get(sheetId) : undefined;

    const handleClick = (event: JSX.TargetedEvent<HTMLCanvasElement, MouseEvent>): void => {
        if (!sheet) { return }
        const { offsetX, offsetY } = event
        const { clientWidth, clientHeight } = event.target as HTMLCanvasElement;
        const newCol = Math.floor(sheet.cols * (offsetX / clientWidth))
        const newRow = Math.floor(sheet.rows * (offsetY / clientHeight))
        pickFrame(newRow, newCol, sheetId)
    }

    return (<>
        <ServiceItemSelector legend="pick sheet"
            service={spriteSheetService} select={(item): void => { pickFrame(0, 0, item.id) }} />
        <p>{sheetId} [ <span>{col}</span>,<span>{row}</span> ]</p>

        {sheet && (
            <SpriteSheetPreview 
                sheet={sheet} 
                highlight={{row,col}}
                canvasScale={300} 
                handleClick={handleClick} />
        )}
    </>
    )
}