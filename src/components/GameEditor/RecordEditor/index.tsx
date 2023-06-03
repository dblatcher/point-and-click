import { ReactNode, useState } from "react";
import { Box, IconButton, Paper, Stack, Typography, PaperProps } from "@mui/material";
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import { StringInput } from "@/components/SchemaForm/StringInput";

interface Props<T> {
    record: Record<string, T | undefined>;
    describeValue: { (key: string, value: T): ReactNode };
    setEntry: { (key: string, value: T | undefined): void };
    addEntry: { (key: string): void };
    renderKeys?: boolean;
    addEntryLabel?: string;
    newKeySuggestions?: string[];
};

const PaperLi = (props: PaperProps) => <Paper {...props} component={'li'}>{props.children}</Paper>

export const RecordEditor = <T,>({
    record,
    addEntry,
    addEntryLabel,
    newKeySuggestions = [],
    describeValue,
    setEntry,
    renderKeys = false
}: Props<T>) => {
    const [newKey, setNewKey] = useState('')

    const existingKeys = Object.keys(record)
    return (
        <Stack component={'ul'} sx={{ margin: 0, padding: 0, listStyle: 'none' }} spacing={1}>
            {Object.entries(record).map(([key, value]) => {
                if (!value) { return null }
                return (
                    <Paper component={'li'} key={key}>
                        <Stack direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'} spacing={1} padding={1}>
                            <IconButton color="error"
                                onClick={() => { setEntry(key, undefined) }}
                            ><DeleteIcon /></IconButton>
                            {renderKeys && <Typography component={'b'} sx={{ fontWeight: 700 }}>{key}</Typography>}
                            {describeValue(key, value)}
                        </Stack>
                    </Paper>
                )
            })}
            <Box component={PaperLi} display={'flex'} justifyContent={'flex-end'} alignItems={'center'} padding={1}>
                <StringInput value={newKey}
                    label={addEntryLabel || 'add entry'}
                    inputHandler={newKey => setNewKey(newKey)}
                    suggestions={newKeySuggestions.filter(suggestion => !existingKeys.includes(suggestion))}
                />
                <IconButton color="primary" disabled={!newKey}
                    onClick={() => {
                        if (!newKey) { return }
                        setNewKey('')
                        addEntry(newKey)
                    }}
                ><AddIcon /></IconButton>
            </Box>
        </Stack>
    )
}
