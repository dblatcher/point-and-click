import { SelectInput } from "@/components/SchemaForm/inputs";
import { Conversation } from "point-click-lib";
import { ChoiceRefSet } from "point-click-lib";
import { findById, listIds } from "@/lib/util";
import { IconButton, Stack } from '@mui/material';
import { ClearIcon } from "../material-icons";

interface Props {
    refSet: ChoiceRefSet;
    change: { (newSet: ChoiceRefSet): void };
    remove: { (): void };
    conversations: Conversation[];
    currentConversationId: string;
    openBranchId: string;
}

export const ChoiceSelector = ({
    refSet, change, remove, conversations, currentConversationId, openBranchId,
}: Props) => {

    const { choiceRef, branchId, conversationId } = refSet;

    const conversation = findById(conversationId || currentConversationId, conversations)
    const branches = conversation?.branches || {};
    const branch = branches[branchId || openBranchId]

    const choiceRefs: string[] = branch
        ? branch.choices
            .map(choice => choice.ref)
            .filter(ref => typeof ref === 'string') as string[]
        : []

    /**
     * BUG - [undefined] => [null] in JSON
     */
    const updateSet = (value: string | undefined, property: keyof ChoiceRefSet) => {
        if (refSet[property] === value) {
            return
        }
        const copy = { ...refSet }
        copy[property] = value
        if (property === 'conversationId') {
            delete copy.branchId
            delete copy.choiceRef
        } else if (property === 'branchId') {
            delete copy.choiceRef
        }
        change(copy)
    }

    return (
        <Stack direction={'row'} alignItems={'center'}>
            <SelectInput value={conversationId || ''}
                options={listIds(conversations)}
                optional
                label="conversation"
                inputHandler={(item) => { updateSet(item, 'conversationId') }}
            />
            <SelectInput value={branchId || ''}
                options={Object.keys(branches)}
                optional
                label="branch"
                inputHandler={(item) => { updateSet(item, 'branchId') }}
            />
            <SelectInput value={choiceRef || ''}
                options={choiceRefs}
                optional
                label="choice"
                inputHandler={(item) => { updateSet(item, 'choiceRef') }}
            />
            <IconButton onClick={remove}><ClearIcon /></IconButton>
        </Stack>
    )
}