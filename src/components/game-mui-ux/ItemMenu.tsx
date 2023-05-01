
import imageService from "@/services/imageService";
import { ItemData } from "@/definitions"
import { CSSProperties, memo } from "react";
import { Button, Grid, Typography, Avatar } from "@mui/material";
import { ItemMenuProps, itemMenuPropsAreEqual } from "../game/uiComponentSet";


const buildBackground = (itemData: ItemData): CSSProperties | undefined => {

    const { imageId, row = 0, col = 0 } = itemData

    if (!imageId) { return undefined }
    const asset = imageService.get(imageId);
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


export const ItemMenu = memo(
    function ItemMenu({ items, currentItemId, select, handleHover }: ItemMenuProps) {
        return (
            <Grid container alignItems={'stretch'} mb={1}>
                {items.map(item => {
                    const imageBackground = buildBackground(item);
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