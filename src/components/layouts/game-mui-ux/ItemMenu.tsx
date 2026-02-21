
import { useGameStateDerivations } from "@/components/layouts/use-derivations";
import { getBackgroundStyle } from "@/lib/image-frame-backgrounds";
import { ImageAsset } from "@/services/assets";
import { Avatar, Button, Grid, Typography } from "@mui/material";
import { GameDataContext, UiStateContext } from "point-click-components";
import { ItemData } from "point-click-lib";
import { CSSProperties, useContext } from "react";
import { ItemMenuProps } from "../../uiComponentSet";

export const ItemMenu = () => {
    const { dispatch } = useContext(GameDataContext)
    const { dispatchUi } = useContext(UiStateContext)
    const { inventory, currentItem, verb } = useGameStateDerivations()

    return <ItemMenuInner
        handleHover={(target, event: "enter" | "leave") =>
            dispatchUi(event === 'enter'
                ? { type: 'SET_HOVER_TARGET', hoverTarget: target }
                : { type: 'SET_HOVER_TARGET', hoverTarget: undefined }
            )
        }
        items={inventory}
        currentItemId={currentItem?.id}
        select={(item) => {
            if (!currentItem && verb?.preposition) {
                return dispatchUi({ type: 'SET_ITEM', itemId: item.id })
            }
            if (item.id === currentItem?.id) {
                return dispatchUi({ type: 'SET_ITEM', itemId: undefined })
            }
            dispatchUi({ type: 'SET_ITEM', itemId: undefined })
            if (verb) {
                dispatch({ type: 'TARGET-CLICK', target: item, verbId: verb.id, itemId: currentItem?.id })
            }
        }}
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
    const style = getBackgroundStyle(asset, col, row);
    delete style.height;
    delete style.width;
    return style;
}


export const ItemMenuInner = function ItemMenu({ items, currentItemId, select, handleHover }: ItemMenuProps) {
    const { getImageAsset } = useContext(GameDataContext)
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
}