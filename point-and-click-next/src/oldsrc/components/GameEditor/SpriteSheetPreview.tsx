import { FunctionComponent, useEffect, useRef, MouseEventHandler } from "react";
import { ImageAsset } from "../../services/imageService";
import editorStyles from './editorStyles.module.css';

interface Props {
    imageAsset: ImageAsset;
    canvasScale: number;
    highlight?: { row: number; col: number };
    handleClick?: MouseEventHandler<HTMLCanvasElement>;
}

export const SpriteSheetPreview: FunctionComponent<Props> = ({ imageAsset, canvasScale, handleClick, highlight }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) { return }
        const ctx = canvas.getContext('2d')
        if (!ctx) { return }
        const { rows = 1, cols = 1 } = imageAsset

        ctx.clearRect(0, 0, canvasScale, canvasScale)
        ctx.lineWidth = 3;
        ctx.setLineDash([])
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

        if (highlight) {
            ctx.lineWidth = 6;
            ctx.strokeStyle = 'white';
            ctx.setLineDash([2, 1])
            const squarePoints: [number, number][] = [
                [canvasScale * (highlight.col + 0) / cols, canvasScale * (highlight.row + 0) / rows],
                [canvasScale * (highlight.col + 1) / cols, canvasScale * (highlight.row + 0) / rows],
                [canvasScale * (highlight.col + 1) / cols, canvasScale * (highlight.row + 1) / rows],
                [canvasScale * (highlight.col + 0) / cols, canvasScale * (highlight.row + 1) / rows],
            ]
            ctx.beginPath()
            ctx.moveTo(...squarePoints[0])
            ctx.lineTo(...squarePoints[1])
            ctx.lineTo(...squarePoints[2])
            ctx.lineTo(...squarePoints[3])
            ctx.lineTo(...squarePoints[0])
            ctx.fillStyle = "rgba(255,255,255,.25)"
            ctx.fillRect(...squarePoints[0], canvasScale * (1 / cols), canvasScale * (1 / rows))
            ctx.stroke()
        }
    }, [imageAsset, canvasScale, highlight])


    return (
        <figure className={editorStyles.spriteSheetPreview} style={{ cursor: !!handleClick ? 'pointer' : undefined }}>
            { <img src={imageAsset.href} alt='sprite preview' />}
            <canvas ref={canvasRef}
                onClick={handleClick}
                height={canvasScale}
                width={canvasScale} />
        </figure>
    )
}