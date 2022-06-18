import { FunctionalComponent, h, Fragment, JSX } from "preact";
import spriteSheetService from "../../services/spriteSheetService";
import { ServiceItemSelector } from "../ServiceItemSelector";
import { useState } from "preact/hooks";
import styles from '../editorStyles.module.css';
import { SpriteSheetPreview } from "../SpriteSheetPreview";

export const FramePicker: FunctionalComponent = () => {

    const [spriteId, setSpriteId] = useState<string>()
    const [col, setCol] = useState(0)
    const [row, setRow] = useState(0)

    const sheet = spriteId ? spriteSheetService.get(spriteId) : undefined;

    const handleClick = (event: JSX.TargetedEvent<HTMLCanvasElement, MouseEvent>): void => {
        if (!sheet) { return }
        const { offsetX, offsetY } = event
        const target = event.target as HTMLCanvasElement;
        const { clientWidth, clientHeight } = target;
        const { rows, cols } = sheet
        const newCol = Math.floor(cols * (offsetX / clientWidth))
        const newRow = Math.floor(rows * (offsetY / clientHeight))
        setCol(newCol)
        setRow(newRow)
    }

    return (<>
        <ServiceItemSelector legend="pick sheet"
            service={spriteSheetService} select={(item) => { setSpriteId(item.id) }} />
        <p>{spriteId} [ <span>{col}</span>,<span>{row}</span> ]</p>

        {sheet && (
            <SpriteSheetPreview sheet={sheet} canvasScale={300} handleClick={handleClick} />
        )}
    </>
    )
}