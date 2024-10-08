import {AddIcon} from "@/components/GameEditor/material-icons";
import { DeleteIcon } from "@/components/GameEditor/material-icons";
import { Box, IconButton, Stack, StackProps, Typography } from "@mui/material";
import { ReactNode } from "react";
import { ButtonWithTextInput } from "../ButtonWithTextInput";

interface Props<T> {
    record: Record<string, T | undefined>;
    describeValue: { (key: string, value: T): ReactNode };
    setEntry: { (key: string, value: T | undefined): void };
    addEntry: { (key: string): void };
    renderKeys?: boolean;
    addEntryLabel?: string;
    newKeySuggestions?: string[];
    containerProps?: StackProps;
};


export const RecordEditor = <T,>({
    record,
    addEntry,
    addEntryLabel,
    newKeySuggestions = [],
    describeValue,
    setEntry,
    renderKeys = false,
    containerProps,
}: Props<T>) => {
    const populatedEntries = Object.entries(record).filter(([_, value]) => typeof value !== 'undefined') as [string, T][]
    const existingKeys = Object.keys(record)

    return (
        <Stack spacing={1} {...containerProps}>
            {populatedEntries.map(([key, value]) => (
                <Stack key={key}
                    direction={'row'}
                    alignItems={'center'}
                    justifyContent={'space-between'} spacing={1}
                >
                    {renderKeys && <Typography component={'b'} sx={{ fontWeight: 700 }}>{key}</Typography>}

                    {describeValue(key, value)}

                    <IconButton color="error"
                        onClick={() => { setEntry(key, undefined) }}
                    ><DeleteIcon /></IconButton>
                </Stack>
            ))}
            <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
                <ButtonWithTextInput
                    dialogTitle={addEntryLabel || 'add entry'}
                    label={addEntryLabel || 'add entry'}
                    onEntry={(input) => {
                        if (!input) { return }
                        if (existingKeys.includes(input)) { return }
                        addEntry(input)
                    }}
                    suggestions={newKeySuggestions.filter(suggestion => !existingKeys.includes(suggestion))}
                    useIconButton={populatedEntries.length > 0}
                    buttonProps={{
                        variant: 'contained',
                        endIcon: < AddIcon />,
                    }}
                />
            </Box>
        </Stack>
    )
}
