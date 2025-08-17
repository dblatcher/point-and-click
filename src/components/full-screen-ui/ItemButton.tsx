import { Button } from "@mui/material";
import React from "react";
import { ImageBlock } from "../ImageBlock";
import { ItemData } from "@/definitions";

interface Props {
    item: ItemData
    isActive?: boolean
    disabled?: boolean
    tiny?: boolean,
    handleClick: { (item: ItemData): void }
    handleContextClick?: { (item: ItemData): void }

}

export const ItemButton: React.FunctionComponent<Props> = ({ item, isActive, handleClick, handleContextClick, disabled, tiny }: Props) => {

    return <Button size="small" key={item.id}
        title={item.name ?? item.id}
        disabled={disabled}
        variant={isActive ? 'contained' : 'outlined'}
        onClick={(event) => {
            event.stopPropagation()
            handleClick(item)
        }}
        onContextMenu={(event) => {
            event.preventDefault()
            event.stopPropagation()
            handleContextClick?.(item)
        }}
        sx={{
            height: tiny ? 40 : 64,
            minWidth: tiny ? 40 : 64,
            padding: item.imageId ? 0 : '0 4px',
            textTransform: 'none',
            lineHeight: 1,
        }}
    >
        {item.imageId
            ? <ImageBlock frame={{ imageId: item.imageId, row: item.row, col: item.col }} fitHeight />
            : <span>{item.name || item.id}</span>
        }
    </Button>
}