
import imageService from "@/services/imageService";
import { ItemData } from "@/oldsrc"
import { HandleHoverFunction } from "../game";
import { CSSProperties } from "react";
import { Button, Card, Container, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";

interface Props {
    items: ItemData[];
    currentItemId?: string;
    select: { (item: ItemData): void };
    handleHover?: HandleHoverFunction;
}

const buildBackground = (itemData: ItemData): CSSProperties | undefined => {

    const { imageId, row = 0, col = 0 } = itemData

    if (!imageId) { return undefined }
    const asset = imageService.get(imageId);
    if (!asset) { return undefined }

    const { href: imageUrl, cols, rows } = asset

    if (typeof cols === 'undefined' && typeof rows === 'undefined') {
        return {
            backgroundImage: `url(${imageUrl})`,
            width: '100%',
            height: '100%',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
        }
    }

    return {
        backgroundImage: `url(${imageUrl})`,
        backgroundPositionX: `${-100 * col}%`,
        backgroundPositionY: `${-100 * row}%`,
        backgroundSize: `${100 * (cols || 1)}% ${100 * (rows || 1)}%`,
        width: '100%',
        height: '100%',
    }
}

export function ItemMenu({ items, currentItemId, select, handleHover }: Props) {

    return (
        <Container maxWidth={'sm'} sx={{ padding: 1 }}>

            <Grid container spacing={1} component={Card} paddingRight={1} paddingBottom={1}>
                {items.map(item => {
                    const imageBackground = buildBackground(item);
                    return (
                        <Grid item key={item.id} alignItems='stretch' xs={3} sm={2}>
                            <Button
                                color='secondary'
                                sx={{ ...imageBackground, minHeight: '3rem', }}
                                variant={currentItemId === item.id ? 'contained' : 'outlined'}
                                onClick={() => { select(item) }}
                                onMouseEnter={handleHover ? () => { handleHover(item, 'enter') } : undefined}
                                onMouseLeave={handleHover ? () => { handleHover(item, 'leave') } : undefined}
                            >
                                {!imageBackground && (
                                    <Typography component={'span'}>{item.name || item.id}</Typography>
                                )}
                            </Button>
                        </Grid>
                    )
                })}

                {items.length == 0 && (
                    <Grid item  alignItems='stretch' xs={12} >
                        <Typography component={'span'}>no items</Typography>
                    </Grid>
                )}
            </Grid>
        </Container>
    )
}