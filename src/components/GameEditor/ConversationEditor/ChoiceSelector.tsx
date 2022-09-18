/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { findById, listIds } from "../../../lib/util";
import { Conversation } from "src";
import { SelectInput } from "../formControls";
import { ChoiceRefSet } from "src/definitions/Conversation";


interface Props {
    refSet: ChoiceRefSet;
    change: { (newSet: ChoiceRefSet): void };
    remove: { (): void };
    conversations: Conversation[];
    currentConversationId: string;
    openBranchId: string;
}

export const ChoiceSelector: FunctionalComponent<Props> = ({
    refSet, change, remove, conversations, currentConversationId, openBranchId,
}: Props) => {

    const {choiceRef, branchId, conversationId} = refSet;

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
    const updateSet = (value: string, property: keyof ChoiceRefSet) => {
        if (refSet[property] === value) {
            return
        }
        const copy = {...refSet}
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
        <div>
            <SelectInput value={conversationId || ''}
                items={listIds(conversations)}
                haveEmptyOption={true}
                emptyOptionLabel="[current conversation]"
                onSelect={(item) => { updateSet(item, 'conversationId') }}
            />

            <SelectInput value={branchId || ''}
                items={Object.keys(branches)}
                haveEmptyOption={true}
                emptyOptionLabel="[current branch]"
                onSelect={(item) => { updateSet(item, 'branchId') }}
            />

            <SelectInput value={choiceRef || ''}
                items={choiceRefs}
                haveEmptyOption={true}
                emptyOptionLabel="[none]"
                onSelect={(item) => { updateSet(item, 'choiceRef') }}
            />

            <button onClick={remove}>x</button>
        </div>
    )
}