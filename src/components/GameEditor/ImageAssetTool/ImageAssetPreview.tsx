/* eslint-disable @next/next/no-img-element */
import { FunctionComponent, ReactEventHandler, useEffect, useRef, useState } from "react";
import { ImageAsset } from "@/services/assets";
import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, Modal, Typography } from "@mui/material";
import { EditorBox } from "../layout/EditorBox";
import { HideImageOutlinedIcon, ZoomInIcon } from "../material-icons";
import { clamp, formatFileSize } from "@/lib/util";

interface Props {
    asset: Partial<ImageAsset>;
    temporarySrc?: string
    temporaryFileName?: string
}

const canvasScale = 300
const MAX_WIDTH = 300

const getDisplayDimensions = (
    maxWidth: number,
    maxHeight: number,
    naturalHeight: number | undefined,
    naturalWidth: number | undefined,
    magnify = 1,
): { displayWidth: number, displayHeight: number } => {
    if (!naturalHeight || !naturalWidth) {
        return {
            displayWidth: 150,
            displayHeight: 150,
        }
    }
    const displayWidth = clamp(naturalWidth * magnify, maxWidth);
    const displayHeight = displayWidth * (naturalHeight / naturalWidth);

    if (displayHeight > maxHeight) {
        return {
            displayHeight: maxHeight,
            displayWidth: displayWidth * maxHeight / displayHeight
        }
    }

    return { displayHeight, displayWidth }
}

const plotGrid = (canvas: HTMLCanvasElement, rows: number, cols: number) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) { return }

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
}

const ImageFigure = ({
    imageSourceToUse,
    naturalHeight,
    naturalWidth,
    imageAsset,
    handleLoadEvent,
    maxWidth = 300,
    maxHeight = 400,
    magnify
}: {
    imageSourceToUse?: string;
    naturalHeight: number | undefined;
    naturalWidth: number | undefined;
    imageAsset: Props['asset'];
    handleLoadEvent?: ReactEventHandler<HTMLImageElement>
    maxWidth?: number;
    maxHeight?: number;
    magnify?: number;
}) => {
    const { displayHeight, displayWidth } = getDisplayDimensions(clamp(maxWidth, window.innerWidth), maxHeight, naturalHeight, naturalWidth, magnify)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        const { rows = 1, cols = 1 } = imageAsset
        if (canvasRef.current) {
            plotGrid(canvasRef.current, rows, cols)
        }

    }, [imageAsset])

    return <Box component='figure'
        width={displayWidth}
        height={displayHeight}
        position={'relative'}
        margin={'0 auto'}
        sx={{
            overflow: 'hidden',
        }}
    >
        {imageSourceToUse ? (
            <img src={imageSourceToUse}
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
}

export const ImageAssetPreview: FunctionComponent<Props> = ({ asset: imageAsset, temporarySrc, temporaryFileName }: Props) => {
    const [fullScreenModalOpen, setFullScreenModalOpen] = useState(false)
    const [naturalHeight, setNaturalHeight] = useState<number | undefined>()
    const [naturalWidth, setNaturalWidth] = useState<number | undefined>()

    useEffect(() => {
        if (!imageAsset.id) {
            setNaturalHeight(undefined)
            setNaturalWidth(undefined)
        }
    }, [imageAsset])

    const handleLoadEvent: ReactEventHandler<HTMLImageElement> = (event) => {
        const img = event.target instanceof HTMLImageElement ? event.target : undefined
        if (!img) {
            setNaturalHeight(undefined)
            setNaturalWidth(undefined)
            return
        }
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
        <EditorBox title="Image Preview"
            contentBoxProps={{
                minWidth: MAX_WIDTH,
                position: 'relative',
            }}
            barContent={
                <Typography textAlign={'center'} display={'flex'} gap={5}>
                    <b>{getLabel()}</b>
                    <span>{formatFileSize(imageAsset.size)}</span>
                </Typography>
            }
        >
            <ImageFigure
                maxWidth={MAX_WIDTH}
                maxHeight={400}
                naturalHeight={naturalHeight}
                naturalWidth={naturalWidth}
                imageAsset={imageAsset}
                imageSourceToUse={imageSourceToUse}
                handleLoadEvent={handleLoadEvent}
            />

            <Box display={'flex'} justifyContent={'flex-end'} gap={10}>
                {naturalHeight && naturalWidth && (
                    <Typography variant="caption"> {naturalWidth} x {naturalHeight}</Typography>
                )}
            </Box>
            <IconButton onClick={() => setFullScreenModalOpen(true)}
                disabled={!imageSourceToUse}
                sx={{
                    position: 'absolute',
                    right: 0,
                    top: 0
                }} ><ZoomInIcon /></IconButton>

            <Dialog fullScreen open={fullScreenModalOpen} onClose={() => setFullScreenModalOpen(false)}>
                <DialogActions>
                    <Button onClick={() => setFullScreenModalOpen(false)}>close</Button>
                </DialogActions>
                <DialogContent >
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                    }}>
                        <ImageFigure
                            maxWidth={1000}
                            maxHeight={1000}
                            naturalHeight={naturalHeight}
                            naturalWidth={naturalWidth}
                            imageAsset={imageAsset}
                            imageSourceToUse={imageSourceToUse}
                            handleLoadEvent={handleLoadEvent}
                            magnify={3}
                        />
                    </Box>
                </DialogContent>
            </Dialog>
        </EditorBox>
    )
}