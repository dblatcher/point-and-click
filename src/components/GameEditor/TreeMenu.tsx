import { FunctionComponent } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, useTheme, List, ListItemButton, ListItemText, ListItemIcon } from "@mui/material";
import { AddIcon, ExpandMoreIcon } from "@/components/GameEditor/material-icons"

export type EntryClickFunction = { (folderId: string, data: { id: string }, isForNew?: boolean): void }
export type FolderClickFunction = { (folderId: string): void }

export interface Entry {
    label?: string;
    data: { id: string };
    active?: boolean;
    isForNew?: boolean;
}

export interface Folder {
    id: string;
    label?: string;
    open?: boolean;
    entries?: Entry[];
}

interface Props {
    folders: Folder[];
    folderClick: FolderClickFunction;
    entryClick: EntryClickFunction;
}

export const TreeMenu: FunctionComponent<Props> = ({ folders, folderClick, entryClick }: Props) => {
    const theme = useTheme()
    return (<Box sx={{ overflowY: 'auto' }}>
        {folders.map((folder, index) => (
            <Accordion
                disableGutters key={index}
                expanded={folder.open}
                onChange={() => { folderClick(folder.id) }
                }>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                        backgroundColor: folder.open ? theme.palette.primary.main : undefined,
                        color: folder.open ? theme.palette.primary.contrastText : undefined,
                    }}
                >
                    <Typography>
                        {folder.label ?? folder.id}
                    </Typography>
                </AccordionSummary>

                {folder.entries && (
                    <AccordionDetails sx={{
                        padding: 0
                    }}>
                        <List dense>
                            {folder.entries?.map(entry => (
                                <ListItemButton
                                    key={folder.id + entry.data.id}
                                    selected={entry.active}
                                    onClick={() => { entryClick(folder.id, entry.data, entry.isForNew) }}>

                                    <ListItemText inset={!entry.isForNew} primary={entry.label || entry.data.id} />
                                    {entry.isForNew && (
                                        <ListItemIcon>
                                            <AddIcon />
                                        </ListItemIcon>
                                    )}
                                </ListItemButton>
                            ))}
                        </List>
                    </AccordionDetails>
                )}
            </Accordion>
        ))}
    </Box>
    )
}