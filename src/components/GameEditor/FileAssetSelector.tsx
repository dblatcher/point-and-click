import { DeleteIcon } from "@/components/GameEditor/material-icons";
import { useAssets } from "@/context/asset-context";
import { findById, formatFileSize, listIds } from "@/lib/util";
import { FileAsset } from "@/services/assets";
import { Box, IconButton, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useState } from "react";
import { SelectInput } from "../SchemaForm/SelectInput";
import { EditorBox } from "./layout/EditorBox";
import { SearchControl } from "./SearchControl";

interface Props {
    assetType: 'image' | 'sound'
    legend: string;
    select: { (item: FileAsset): void };
    selectNone?: { (): void };
    format?: 'buttons' | 'select';
    selectedItemId?: string;
    filterItems?: { (item: FileAsset): boolean };
    currentSelection?: string;
}

const describeAsset = ({id, size}:FileAsset) => {
    if (typeof size==='undefined') {
        return id
    }
    return `${id}, ${formatFileSize(size)}`
} 

export const FileAssetSelector = ({
    assetType,
    select,
    selectNone,
    legend,
    format = 'buttons',
    selectedItemId = '',
    filterItems,
    currentSelection,
}: Props) => {
    const [searchInput, setSearchInput] = useState('')
    const assets = useAssets()
    const all: FileAsset[] = assetType === 'image' ? assets.imageAssets : assets.soundAssets
    const deleteItem = assetType === 'image' ? assets.removeImageAsset : assets.removeSoundAsset

    const handleSelect = (id: string) => {
        if (id === '' && selectNone) {
            return selectNone();
        }
        const item = findById(id, all)
        if (item) {
            select(item)
        }
    }

    const itemsInFilter = filterItems
        ? all.filter(filterItems)
        : all;

    const searchedItemsInFilter = searchInput !== ''
        ? itemsInFilter.filter(({ id }) => id.toLowerCase().includes(searchInput.toLowerCase()))
        : itemsInFilter


    switch (format) {
        case 'select':
            return (
                <Box padding={1} minWidth={120}>
                    <SelectInput label={legend}
                        optional options={listIds(itemsInFilter)}
                        value={selectedItemId}
                        inputHandler={value => { handleSelect(value ?? '') }} />
                </Box>
            )
        case 'buttons':
        default:
            return (
                <EditorBox title={legend} contentBoxProps={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', minWidth: 200 }}>
                    <SearchControl searchInput={searchInput} setSearchInput={setSearchInput} />
                    <List dense disablePadding>
                        {searchedItemsInFilter.map((asset) =>
                            <ListItem key={asset.id} disablePadding disableGutters
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => { deleteItem(asset.id) }}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemButton
                                    selected={asset.id === currentSelection}
                                    onClick={() => { handleSelect(asset.id) }}>
                                    <ListItemText primary={describeAsset(asset)} />
                                </ListItemButton>
                            </ListItem>
                        )}
                    </List>
                </EditorBox>
            )
    }
}