import { FunctionComponent } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button, Box, useTheme } from "@mui/material";

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
    return (<Box>
        {folders.map((folder, index) => (
            <Accordion disableGutters key={index} expanded={folder.open} onChange={() => {
                folderClick(folder.id)
            }}>
                <AccordionSummary sx={{
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
                        padding:0.5
                    }}>
                        {folder.entries?.map(entry => (
                            <Button
                                key={folder.id + entry.data.id}
                                fullWidth
                                size="small"
                                variant={entry.active ? 'contained' : 'outlined'}
                                onClick={() => { entryClick(folder.id, entry.data, entry.isForNew) }}>
                                <span>{entry.label || entry.data.id}</span>
                            </Button>
                        ))}
                    </AccordionDetails>
                )}
            </Accordion>
        ))}
    </Box>
    )
}