import { StringInput } from '@/components/SchemaForm/inputs';
import AddIcon from "@mui/icons-material/Add";
import { IconButton, Stack } from '@mui/material';
import { FunctionComponent, useState } from 'react';
import { Sequence } from '../../../definitions/Sequence';
import { makeBlankSequence } from '../defaults';

interface Props {
    addSequence: { (sequence: Sequence): void };
    existingIds: string[];
    suggestedIds?: string[];
}

export const NewSequenceForm: FunctionComponent<Props> = ({ addSequence, existingIds, suggestedIds }) => {
    const [newId, setNewId] = useState('')
    const idIsAvailable = newId.length > 0 && !existingIds.includes(newId)

    const handleSubmit = (): void => {
        if (idIsAvailable) {
            addSequence(makeBlankSequence(newId))
        }
    }

    return (
        <Stack direction={'row'} flex={1}>
            <StringInput label='Use new Sequence'
                value={newId}
                inputHandler={setNewId}
                suggestions={suggestedIds} />
            <IconButton onClick={handleSubmit}
                disabled={!idIsAvailable}>
                <AddIcon />
            </IconButton>
        </Stack>
    )
}