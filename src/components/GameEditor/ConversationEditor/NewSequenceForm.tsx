import { StringInput } from '@/components/SchemaForm/inputs';
import { AddIcon } from "@/components/GameEditor/material-icons";
import { IconButton, Stack } from '@mui/material';
import { FunctionComponent, useState } from 'react';
import { Sequence } from '../../../definitions/Sequence';
import { makeBlankSequence } from '../defaults';

interface Props {
    addSequence: { (sequence: Sequence): void };
    existingIds: string[];
    suggestedIds?: string[];
    defaultActorIds?: string[];
}

export const NewSequenceForm: FunctionComponent<Props> = ({ addSequence, existingIds, suggestedIds, defaultActorIds }) => {
    const [newId, setNewId] = useState('')
    const idIsAvailable = newId.length > 0 && !existingIds.includes(newId)

    const handleSubmit = (): void => {
        if (idIsAvailable) {
            const newSequence = makeBlankSequence(newId, defaultActorIds)
            addSequence(newSequence)
        }
    }

    return (
        <Stack direction={'row'} flex={1}>
            <StringInput label='Use new Sequence'
                value={newId}
                inputHandler={setNewId}
                suggestions={suggestedIds} />
            <IconButton onClick={handleSubmit} color='primary'
                disabled={!idIsAvailable}>
                <AddIcon />
            </IconButton>
        </Stack>
    )
}