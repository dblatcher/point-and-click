import { DeleteIcon } from "@/components/GameEditor/material-icons";
import { formatFileSize } from "@/lib/util";
import { FileAsset } from "@/services/assets";
import { Box, List, ListItem, ListItemButton, ListItemText, useTheme } from "@mui/material";
import { useState } from "react";
import { ButtonWithConfirm } from "../ButtonWithConfirm";
import { EditorBox } from "../layout/EditorBox";
import { SearchControl } from "../SearchControl";
import { useSelectAsset } from "./useSelectAsset";

interface Props {
    assetType: 'image' | 'sound'
    legend: string;
    select: { (item: FileAsset): void };
    selectNone?: { (): void };
    filterItems?: { (item: FileAsset): boolean };
    currentSelection?: string;
}

export const FileAssetList = ({
    assetType,
    select,
    selectNone,
    legend,
    filterItems,
    currentSelection,
}: Props) => {
    const { itemsInFilter, handleSelect, deleteItem } = useSelectAsset({ assetType, select, selectNone, filterItems })
    const [searchInput, setSearchInput] = useState('')
    const searchedItemsInFilter = searchInput !== ''
        ? itemsInFilter.filter(({ id }) => id.toLowerCase().includes(searchInput.toLowerCase()))
        : itemsInFilter

    const theme = useTheme();

    return (
        <EditorBox title={legend} contentBoxProps={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', minWidth: 200 }}>
            <SearchControl searchInput={searchInput} setSearchInput={setSearchInput} />
            <List dense disablePadding sx={{
                [theme.breakpoints.down('md')]: {
                    height: 160,
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                }
            }}>
                {searchedItemsInFilter.map((asset) =>
                    <ListItem key={asset.id} disablePadding disableGutters
                        secondaryAction={
                            <ButtonWithConfirm
                                label={`delete ${assetType} asset "${asset.id}"`}
                                onClick={() => { deleteItem(asset.id) }}
                                useIconButton
                                icon={<DeleteIcon />}
                                buttonProps={{
                                    color: 'warning',
                                }}
                            />
                        }
                    >
                        <ListItemButton
                            selected={asset.id === currentSelection}
                            onClick={() => { handleSelect(asset.id) }}>
                            <ListItemText primary={<Box display={'flex'} justifyContent={'space-between'}><b>{asset.id}</b>{formatFileSize(asset.size)}</Box>} />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </EditorBox>
    )
}