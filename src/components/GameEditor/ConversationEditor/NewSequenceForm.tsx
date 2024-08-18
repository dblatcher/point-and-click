import { AddIcon } from "@/components/GameEditor/material-icons";
import { StringInput } from '@/components/SchemaForm/inputs';
import { Button, Stack } from '@mui/material';
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
            <Button onClick={handleSubmit}
                sx={{ flexShrink: 0 }}
                startIcon={<AddIcon />}
                color='primary'
                disabled={!idIsAvailable}>
                create sequence
            </Button>
        </Stack>
    )
}