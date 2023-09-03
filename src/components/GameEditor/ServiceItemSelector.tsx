import { FunctionComponent, useEffect, useState } from "react";
import { Service, ServiceItem } from "@/services/Service";

import { StringInput } from "../SchemaForm/StringInput";
import { SelectInput } from "../SchemaForm/SelectInput";
import { Box, List, IconButton, ListItemButton, ListItemText } from "@mui/material";
import { EditorBox } from "./EditorBox";
import DeleteIcon from "@mui/icons-material/Delete"

interface Props {
    service: Service<ServiceItem>;
    legend: string;
    select: { (item: ServiceItem): void };
    selectNone?: { (): void };
    format?: 'buttons' | 'select';
    selectedItemId?: string;
    filterItems?: { (item: ServiceItem): boolean };
    currentSelection?: string;
}

export const ServiceItemSelector: FunctionComponent<Props> = ({
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

    const list = filterItems
        ? service.getAll().filter(filterItems).map(item => item.id)
        : service.list();

    const searchedList = searchInput !== '' ? list.filter(id => id.toLowerCase().includes(searchInput.toLowerCase())) : list

    switch (format) {
        case 'select':
            return (
                <Box padding={1} minWidth={120}>
                    <SelectInput label={legend}
                        optional options={list}
                        value={selectedItemId}
                        inputHandler={value => { handleSelect(value ?? '') }} />
                </Box>

            )
        case 'buttons':
        default:
            return (
                <EditorBox title={legend}>
                    <StringInput label="search" value={searchInput} inputHandler={setSearchInput} />
                    <List dense>
                        {searchedList.map(id =>
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