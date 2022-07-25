/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { findById, listIds } from "../../../lib/util";
import { Conversation } from "../../../definitions/Conversation";
import { SelectInput } from "../formControls";


interface Props {
    refSet: (string | undefined)[];
    change: { (newSet: (string | undefined)[]): void };
    remove: { (): void };
    conversations: Conversation[];
    currentConversationId: string;
    openBranchId: string;
}

export const ChoiceSelector: FunctionalComponent<Props> = ({
    refSet, change, remove, conversations, currentConversationId, openBranchId,
}: Props) => {

    const [choiceRef, branchId, conversationId] = refSet;

    const conversation = findById(conversationId || currentConversationId, conversations)
    const branches = conversation?.branches || {};
    const branch = branches[branchId || openBranchId]

    const choiceRefs: string[] = branch?.choices
        .map(choice => choice.ref)
        .filter(ref => typeof ref === 'string') as string[]

    const updateSet = (value: string, index: number) => {
        if (refSet[index] === value) {
            return
        }
        const copy = [...refSet]
        copy[index] = value
        if (index > 0) { copy[0] = undefined }
        if (index > 1) { copy[1] = undefined }

        change(copy)
    }

    return (
        <div>


            <SelectInput value={conversationId || ''}
                items={listIds(conversations)}
                haveEmptyOption={true}
                emptyOptionLabel="[current conversation]"
                onSelect={(item) => { updateSet(item, 2) }}
            />

            <SelectInput value={branchId || ''}
                items={Object.keys(branches)}
                haveEmptyOption={true}
                emptyOptionLabel="[current branch]"
                onSelect={(item) => { updateSet(item, 1) }}
            />

            <SelectInput value={choiceRef || ''}
                items={choiceRefs}
                haveEmptyOption={true}
                emptyOptionLabel="[none]"
                onSelect={(item) => { updateSet(item, 0) }}
            />

            <button onClick={remove}>x</button>
        </div>
    )
}