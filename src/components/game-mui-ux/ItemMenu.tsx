
import { useAssets } from "@/context/asset-context";
import { useGameState, useGameStateDerivations } from "@/context/game-state-context";
import { ItemData } from "@/definitions";
import { ImageAsset } from "@/services/assets";
import { Avatar, Button, Grid, Typography } from "@mui/material";
import { CSSProperties, memo } from "react";
import { ItemMenuProps, itemMenuPropsAreEqual } from "../game/uiComponentSet";


export const ItemMenu = () => {
    const { updateGameState } = useGameState()
    const { inventory, currentItem } = useGameStateDerivations()
    return <ItemMenuInner
        handleHover={(target, event: "enter" | "leave") => updateGameState({ type: 'HANDLE-HOVER', target, event })}
        items={inventory}
        currentItemId={currentItem?.id}
        select={(target) => updateGameState({ type: 'TARGET-CLICK', target })}
    />
}

const buildBackground = (
    itemData: ItemData,
    getAsset: { (id: string): ImageAsset | undefined }
): CSSProperties | undefined => {

    const { imageId, row = 0, col = 0 } = itemData

    if (!imageId) { return undefined }
    const asset = getAsset(imageId);
    if (!asset) { return undefined }

    const { href: imageUrl, cols, rows } = asset

    const common = {
        backgroundImage: `url(${imageUrl})`,
    }

    if (typeof cols === 'undefined' && typeof rows === 'undefined') {
        return {
            ...common,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
        }
    }

    return {
        ...common,
        backgroundPositionX: `${-100 * col}%`,
        backgroundPositionY: `${-100 * row}%`,
        backgroundSize: `${100 * (cols || 1)}% ${100 * (rows || 1)}%`,
    }
}


export const ItemMenuInner = memo(
    function ItemMenu({ items, currentItemId, select, handleHover }: ItemMenuProps) {
        const { getImageAsset } = useAssets()
        return (
            <Grid container alignItems={'stretch'} mb={1}>
                {items.map(item => {
                    const imageBackground = buildBackground(item, getImageAsset);
                    const initialLetter = item.name ? item.name.charAt(0) : item.id.charAt(0);
                    return (
                        <Grid item key={item.id} xs={2} sm={1.5} md={1}>
                            <Button
                                color='secondary'
                                size="small"
                                variant={currentItemId === item.id ? 'contained' : 'text'}
                                onClick={() => { select(item) }}
                                onMouseEnter={handleHover ? () => { handleHover(item, 'enter') } : undefined}
                                onMouseLeave={handleHover ? () => { handleHover(item, 'leave') } : undefined}
                            >
                                <Avatar sx={{ ...imageBackground }}>{imageBackground ? '' : initialLetter}</Avatar>
                            </Button>
                        </Grid>
                    )
                })}

                {items.length === 0 && (
                    <Grid item alignItems='stretch' xs={12} >
                        <Typography component={'span'}>no items</Typography>
                    </Grid>
                )}
            </Grid>
        )
    }, itemMenuPropsAreEqual)