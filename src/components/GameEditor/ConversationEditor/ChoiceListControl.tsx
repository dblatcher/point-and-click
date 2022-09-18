/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { Conversation } from "src";
import { ChoiceRefSet } from "src/definitions/Conversation";
import { ChoiceSelector } from "./ChoiceSelector";

interface Props {
    property: 'enablesChoices' | 'disablesChoices';
    choices: ChoiceRefSet[];
    change: { (property: 'enablesChoices' | 'disablesChoices', indexOfSet: number, newRefSet: ChoiceRefSet,): void };
    remove: { (property: 'enablesChoices' | 'disablesChoices', index: number): void };
    add: { (property: 'enablesChoices' | 'disablesChoices'): void };
    conversations: Conversation[];
    currentConversationId: string;
    openBranchId: string;
}

export const ChoiceListControl: FunctionalComponent<Props> = ({
    property,
    choices, change, remove, add, conversations, currentConversationId, openBranchId,
}: Props) => {

    return (
        <article style={{
            borderBottom: '1px dotted black',
            borderTop: '1px dotted black',
        }}>
            <p>{property}</p>
            {
                choices?.map((refSet, index) => (
                    <ChoiceSelector refSet={refSet} key={index}
                        conversations={conversations}
                        currentConversationId={currentConversationId}
                        openBranchId={openBranchId || ''}
                        change={(newSet) => { change(property, index, newSet) }}
                        remove={() => { remove(property, index) }}
                    />
                ))
            }
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span>Add choice</span>
                <button onClick={() => { add(property) }}>+</button>
            </div>
        </article>
    )
}