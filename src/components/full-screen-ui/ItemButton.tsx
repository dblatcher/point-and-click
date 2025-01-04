import { Button } from "@mui/material";
import React from "react";
import { ImageBlock } from "../ImageBlock";
import { ItemData } from "@/definitions";

interface Props {
    item: ItemData
    isActive?:boolean
    disabled?:boolean
    handleClick: {(item:ItemData):void}
    handleContextClick?: {(item:ItemData):void}
}

export const ItemButton: React.FunctionComponent<Props> = ({ item, isActive, handleClick, handleContextClick, disabled }: Props) => {

    return <Button size="small" key={item.id}
        disabled={disabled}
        variant={isActive ? 'contained' : 'outlined'}
        onClick={() => handleClick(item)}
        onContextMenu={(event) => {
            event.preventDefault()
            handleContextClick?.(item)
        }}
        sx={{
            height: '4rem'
        }}
    >
        {item.imageId
            ? <ImageBlock frame={{ imageId: item.imageId, row: item.row, col: item.col }} />
            : <span>{item.name || item.id}</span>
        }
    </Button>
}