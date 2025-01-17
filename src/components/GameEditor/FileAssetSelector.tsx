import { findById, listIds } from "@/lib/util";
import { FileAsset } from "@/services/assets";
import { DeleteIcon } from "@/components/GameEditor/material-icons";
import { Box, Grid, IconButton, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useState } from "react";
import { SelectInput } from "../SchemaForm/SelectInput";
import { StringInput } from "../SchemaForm/StringInput";
import { EditorBox } from "./EditorBox";
import { AssetCard } from "./asset-components/AssetCard";
import { useAssets } from "@/context/asset-context";

interface Props {
    assetType: 'image' | 'sound'
    legend: string;
    select: { (item: FileAsset): void };
    selectNone?: { (): void };
    format?: 'buttons' | 'select' | 'folder';
    selectedItemId?: string;
    filterItems?: { (item: FileAsset): boolean };
    currentSelection?: string;
}

export const FileAssetSelector = ({
    assetType, select, selectNone, legend, format = 'buttons', selectedItemId = '', filterItems, currentSelection,
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
        case 'folder':
            return (
                <EditorBox title={legend}>
                    <Box>
                        <StringInput label="search" value={searchInput} inputHandler={setSearchInput} />
                    </Box>
                    <Grid container spacing={1} flexWrap={'wrap'}>
                        {searchedItemsInFilter.map(asset => (
                            <Grid item key={asset.id}>
                                <AssetCard
                                    asset={asset}
                                    handleClick={() => { handleSelect(asset.id) }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </EditorBox>
            )
        case 'buttons':
        default:
            return (
                <EditorBox title={legend}>
                    <StringInput label="search" value={searchInput} inputHandler={setSearchInput} />
                    <List dense disablePadding>
                        {searchedItemsInFilter.map(({ id }) =>
                            <ListItem key={id} disablePadding disableGutters
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => { deleteItem(id) }}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemButton
                                    selected={id === currentSelection}
                                    onClick={() => { handleSelect(id) }}>
                                    <ListItemText primary={id} />
                                </ListItemButton>
                            </ListItem>
                        )}
                    </List>
                </EditorBox>
            )
    }
}