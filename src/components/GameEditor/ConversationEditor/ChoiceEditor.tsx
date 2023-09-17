import { FieldDef, FieldValue, SchemaForm } from "@/components/SchemaForm"
import { ChoiceRefSet, Conversation, ConversationChoice, ConversationChoiceSchema } from "@/definitions/Conversation"
import { listIds } from "@/lib/util"
import { Stack } from "@mui/material"
import { SelectInput } from "@/components/SchemaForm/SelectInput"
import { ChoiceListControl } from "./ChoiceListControl"
import { NewSequenceForm } from "./NewSequenceForm"
import { useGameDesign } from "@/context/game-design-context"
import { Sequence } from "@/definitions"


interface Props {
    choice: ConversationChoice
    conversation: Conversation

    openBranchId: string,
    activeChoiceIndex: number
    addSequence: { (sequence: Sequence): void };
    handleChoiceChange: { (value: FieldValue, field: FieldDef): void };
    addChoiceListItem: { (property: 'enablesChoices' | 'disablesChoices'): void };
    removeChoiceListItem: { (property: 'enablesChoices' | 'disablesChoices', index: number): void };
    updateChoiceListItem: {
        (property: 'enablesChoices' | 'disablesChoices',
            indexOfSet: number,
            newRefSet: ChoiceRefSet): void
    };
}

export const ChoiceEditor = ({
    choice, conversation, openBranchId, activeChoiceIndex,
    addSequence, handleChoiceChange, addChoiceListItem, removeChoiceListItem, updateChoiceListItem
}: Props) => {

    const { gameDesign: design } = useGameDesign()
    const { id, branches } = conversation

    return (<Stack spacing={2}>
        <SchemaForm
            schema={ConversationChoiceSchema.omit({
                'sequence': true
            })}
            data={choice}
            changeValue={handleChoiceChange}
            options={{
                nextBranch: Object.keys(branches),
            }}
        />

        <ChoiceListControl
            choices={choice.disablesChoices || []}
            property="disablesChoices"
            conversations={design.conversations}
            currentConversationId={id}
            openBranchId={openBranchId || ''}
            add={addChoiceListItem}
            change={updateChoiceListItem}
            remove={removeChoiceListItem}
        />
        <ChoiceListControl
            choices={choice.enablesChoices || []}
            property="enablesChoices"
            conversations={design.conversations}
            currentConversationId={id}
            openBranchId={openBranchId || ''}
            add={addChoiceListItem}
            change={updateChoiceListItem}
            remove={removeChoiceListItem}
        />

        <Stack direction={'row'} spacing={2} justifyContent={'space-between'}>
            <SelectInput
                value={choice.sequence}
                options={listIds(design.sequences)}
                label="sequence"
                inputHandler={(value) => {
                    handleChoiceChange(value, {
                        key: 'sequence',
                        optional: true,
                        type: 'ZodString',
                        value: choice.sequence
                    })
                }}
            />

            <NewSequenceForm
                suggestedIds={[
                    `${id}-${openBranchId}-${activeChoiceIndex}`,
                ]}
                existingIds={listIds(design.sequences)}
                addSequence={addSequence}
            />

        </Stack>

    </Stack>
    )
}