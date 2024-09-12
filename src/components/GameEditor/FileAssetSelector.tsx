import { listIds } from "@/lib/util";
import { Service } from "@/services/Service";
import { FileAsset } from "@/services/assets";
import { DeleteIcon } from "@/components/GameEditor/material-icons";
import { Box, Grid, IconButton, List, ListItemButton, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import { SelectInput } from "../SchemaForm/SelectInput";
import { StringInput } from "../SchemaForm/StringInput";
import { EditorBox } from "./EditorBox";
import { AssetCard } from "./asset-components/AssetCard";

interface Props {
    service: Service<FileAsset>;
    legend: string;
    select: { (item: FileAsset): void };
    selectNone?: { (): void };
    format?: 'buttons' | 'select' | 'folder';
    selectedItemId?: string;
    filterItems?: { (item: FileAsset): boolean };
    currentSelection?: string;
}

export const FileAssetSelector = ({
    service, select, selectNone, legend, format = 'buttons', selectedItemId = '', filterItems, currentSelection
}: Props) => {

    const [searchInput, setSearchInput] = useState('')
    const [timestamp, setTimestamp] = useState<number>(Date.now())
    const refresh = () => {
        setTimestamp(Date.now())
    }

    useEffect(() => {
        service.on('update', refresh)
        return () => {
            service.off('update', refresh)
        }
    })

    const handleSelect = (id: string) => {
        if (id === '' && selectNone) {
            return selectNone();
        }
        const item = service.get(id)
        if (item) {
            select(item)
        }
    }


    const handleDelete = (id: string) => {
        service.remove(id)
    }

    const itemsInFilter = filterItems
        ? service.getAll().filter(filterItems)
        : service.getAll();

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
                    <List dense>
                        {searchedItemsInFilter.map(({ id }) =>
                            <ListItemButton
                                selected={id === currentSelection}
                                key={id} onClick={() => { handleSelect(id) }}>
                                <ListItemText primary={id} />
                                <IconButton edge="end" aria-label="delete" onClick={() => { handleDelete(id) }}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemButton>
                        )}
                    </List>
                </EditorBox>
            )
    }
}