import { FunctionalComponent, h, JSX } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { SpriteSheet } from "../definitions/SpriteSheet";
import styles from './editorStyles.module.css';

interface Props {
    sheet: SpriteSheet;
    canvasScale: number;
    handleClick?: JSX.MouseEventHandler<HTMLCanvasElement>;
}

export const SpriteSheetPreview: FunctionalComponent<Props> = ({ sheet, canvasScale, handleClick }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) { return }
        const ctx = canvas.getContext('2d')
        if (!ctx) { return }
        const { rows = 1, cols = 1 } = sheet

        ctx.clearRect(0, 0, canvasScale, canvasScale)
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'red';
        for (let i = 1; i < rows; i++) {
            ctx.beginPath()
            ctx.moveTo(0, canvasScale * (i / rows))
            ctx.lineTo(canvasScale, canvasScale * (i / rows))
            ctx.stroke()
        }
        for (let i = 1; i < cols; i++) {
            ctx.beginPath()
            ctx.moveTo(canvasScale * (i / cols), 0)
            ctx.lineTo(canvasScale * (i / cols), canvasScale)
            ctx.stroke()
        }
    }, [sheet, canvasScale])


    return (
        <figure className={styles.spriteSheetPreview}>
            {sheet.url && <img src={sheet.url} />}
            <canvas ref={canvasRef}
                onClick={handleClick}
                height={canvasScale}
                width={canvasScale} />
        </figure>
    )
}