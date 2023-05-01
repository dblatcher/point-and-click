import { Component, ReactNode } from "react";
import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import { StringInput } from "../formControls";

interface Props<T> {
    record: Record<string, T | undefined>;
    describeValue: { (key: string, value: T): ReactNode };
    setEntry: { (key: string, value: T | undefined): void };
    addEntry: { (key: string): void };
    renderKeys?: boolean;
    addEntryLabel?: string;
    newKeySuggestions?: string[];
};

interface State {
    newKey?: string;
}

export class RecordEditor<T> extends Component<Props<T>, State> {

    constructor(props: Props<T>) {
        super(props)
        this.state = {}
        this.renderEntry = this.renderEntry.bind(this)
    }

    renderEntry(entry: [string, T | undefined]) {
        const { describeValue, setEntry, renderKeys = false } = this.props
        const [key, value] = entry

        if (!value) { return null }

        return (
            <Paper component={'li'} >
                <Stack direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'} spacing={1} padding={1}>

                    <IconButton color="error"
                        onClick={() => { setEntry(key, undefined) }}
                    ><DeleteIcon /></IconButton>
                    {renderKeys && <Typography component={'b'} sx={{ fontWeight: 700 }}>{key}</Typography>}
                    {describeValue(key, value)}
                </Stack>
            </Paper>
        )
    }

    render() {
        const { record, addEntry, addEntryLabel, newKeySuggestions = [] } = this.props
        const { newKey = '' } = this.state
        const existingKeys = Object.keys(record)
        return (
            <Stack component={'ul'} sx={{ margin: 0, padding: 0, listStyle: 'none' }} spacing={1}>
                {Object.entries(record).map(this.renderEntry)}
                <Paper component={'li'}>
                    <Box padding={1}>
                        <StringInput value={newKey}
                            label={addEntryLabel || 'add entry'}
                            inputHandler={newKey => this.setState({ newKey })}
                            suggestions={newKeySuggestions.filter(suggestion => !existingKeys.includes(suggestion))}
                        />

                        <IconButton color="success" disabled={!newKey}
                            onClick={() => {
                                if (!newKey) { return }
                                this.setState({ newKey: '' })
                                addEntry(newKey)
                            }}
                        ><AddIcon /></IconButton>
                    </Box>
                </Paper>
            </Stack>
        )
    }
}