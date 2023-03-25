
import { FunctionComponent } from "react";
import { Conversation } from "@/oldsrc";
import { ChoiceRefSet } from "src/definitions/Conversation";
import { ChoiceSelector } from "./ChoiceSelector";
import editorStyles from "../editorStyles.module.css"
import { icons } from "../dataEditors";

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

export const ChoiceListControl: FunctionComponent<Props> = ({
    property,
    choices, change, remove, add, conversations, currentConversationId, openBranchId,
}: Props) => {

    return (
        <article style={{
            borderBottom: '1px dotted black',
            borderTop: '1px dotted black',
        }}>
            <b>{property}</b>
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
                <button
                    className={[editorStyles.button, editorStyles.plusButton].join(" ")}
                    onClick={() => { add(property) }}>
                    {icons.INSERT}
                </button>
            </div>
        </article>
    )
}