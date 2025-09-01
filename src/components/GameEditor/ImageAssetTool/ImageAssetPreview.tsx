/* eslint-disable @next/next/no-img-element */
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { ImageAsset } from "@/services/assets";
import { Box, Typography } from "@mui/material";
import { EditorBox } from "../EditorBox";
import { HideImageOutlinedIcon } from "../material-icons";

interface Props {
    asset: Partial<ImageAsset>;
    temporarySrc?: string
    temporaryFileName?: string
}

const canvasScale = 300

export const ImageAssetPreview: FunctionComponent<Props> = ({ asset: imageAsset, temporarySrc, temporaryFileName }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)

    const [naturalHeight, setNaturalHeight] = useState<number | undefined>()
    const [naturalWidth, setNaturalWidth] = useState<number | undefined>()

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

    }, [imageAsset])

    const handleLoadEvent = () => {
        const img = imageRef.current
        if (!img) { return }
        setNaturalHeight(img.naturalHeight)
        setNaturalWidth(img.naturalWidth)
    }

    const imageSourceToUse = temporarySrc ?? imageAsset.href;

    const getLabel = () => {
        if (temporaryFileName) {
            return temporaryFileName
        }
        if (imageAsset.originalFileName) {
            return imageAsset.originalFileName
        }
        return imageSourceToUse ? '[unnamed]' : '[no image file]';
    }

    return (
        <EditorBox title="Image Preview">
            <Typography textAlign={'center'}>{getLabel()}</Typography>
            <Box component='figure'
                width={400}
                position={'relative'}
                sx={{
                    overflow: 'hidden',
                }}
            >
                {imageSourceToUse ? (
                    <img src={imageSourceToUse}
                        ref={imageRef}
                        alt='sprite preview'
                        style={{
                            width: '100%',
                            height: '100%',
                            boxSizing: 'border-box'
                        }}
                        onLoad={handleLoadEvent}
                    />
                ) : (
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}
                        sx={{
                            width: '100%',
                            height: '100%',
                            minHeight: 150
                        }}>
                        <HideImageOutlinedIcon sx={{
                            width: 100, height: 100
                        }} />
                    </Box>
                )}
                <canvas ref={canvasRef}
                    height={canvasScale}
                    width={canvasScale}
                    style={{
                        width: '100%',
                        height: '100%',
                        top: 0,
                        left: 0,
                        position: 'absolute'
                    }}
                />
            </Box>

            <Box display={'flex'} justifyContent={'flex-end'}>
                {naturalHeight && naturalWidth && (
                    <Typography variant="caption"> {naturalWidth} x {naturalHeight}</Typography>
                )}
            </Box>
        </EditorBox>
    )
}