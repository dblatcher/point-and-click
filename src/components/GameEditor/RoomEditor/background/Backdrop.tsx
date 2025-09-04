import { useAssets } from "@/context/asset-context"
import { BackgroundLayer, RoomData } from "@/definitions"
import { Box } from "@mui/material"
import { ReactNode } from "react"

export const BackDrop = ({ layer, filter, roomData }: { layer: BackgroundLayer, filter?: string, roomData?: RoomData }) => {
    const { getImageAsset } = useAssets()
    const href = getImageAsset(layer.imageId)?.href
    if (!href) {
        return null
    }

    if (layer.placement && roomData) {
        const relativePlacement = {
            width: Math.floor(100 * (layer.placement.width / roomData.width)),
            height: Math.floor(100 * (layer.placement.height / roomData.height)),
            left: Math.floor(100 * (layer.placement.x / roomData.width)),
            top: Math.floor(100 * (layer.placement.y / roomData.height)),
        }

        return <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("${href}")`,
            backgroundSize: `${relativePlacement.width}% ${relativePlacement.height}%`,
            backgroundPositionX: `${relativePlacement.left}%`,
            backgroundPositionY: `${relativePlacement.top}%`,
            backgroundRepeat: 'no-repeat',
            filter: filter,
        }}></div>
    }

    return <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("${href}")`,
        backgroundSize: '100% 100%',
        filter: filter,
    }}></div>
}

export const BackDropFrame = ({ children, frameHeight, roomData }: { frameHeight: number, children: ReactNode, roomData: RoomData }) => (
    <Box
        position={'relative'}
        minWidth={roomData.width * (frameHeight / roomData.height)}
        height={frameHeight}
        width={roomData.width * (frameHeight / roomData.height)}
        border={'1px solid'}
        sx={{
            backgroundColor: roomData.backgroundColor
        }}
    >{children}</Box>
)