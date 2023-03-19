import { FunctionComponent, useState } from 'react';
import { Sequence } from '../../../definitions/Sequence'
import { icons } from '../dataEditors';
import { makeBlankSequence } from '../defaults';
import { StringInput } from '../formControls';

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

    return <div>
        <b>Use new Sequence:</b>
        <StringInput value={newId} inputHandler={setNewId} suggestions={suggestedIds} />
        <button
            onClick={handleSubmit}
            disabled={!idIsAvailable}>
            {icons.INSERT}
        </button>
    </div>
}