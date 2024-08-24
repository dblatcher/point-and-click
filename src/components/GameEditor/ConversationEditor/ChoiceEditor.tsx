import { FieldDef, FieldValue, SchemaForm } from "@/components/SchemaForm"
import { ChoiceRefSet, Conversation, ConversationChoice, ConversationChoiceSchema } from "@/definitions/Conversation"
import { listIds } from "@/lib/util"
import { Box, Button, Stack } from "@mui/material"
import { SelectInput } from "@/components/SchemaForm/SelectInput"
import { ChoiceListControl } from "./ChoiceListControl"
import { NewSequenceForm } from "./NewSequenceForm"
import { useGameDesign } from "@/context/game-design-context"
import { Sequence } from "@/definitions"
import { EditorBox } from "../EditorBox"
import { SequenceEditor } from "../SequenceEditor"
import { makeBlankSequence } from "../defaults"
import { ButtonWithConfirm } from "../ButtonWithConfirm"


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
    actorIdsForSequences: string[];
    openExternalSequence: { (): void }
    handleChoiceSequenceChange: { (sequence?: Sequence): void }
}

export const ChoiceEditor = ({
    choice, conversation, openBranchId, activeChoiceIndex,
    addSequence, handleChoiceChange, addChoiceListItem, removeChoiceListItem, updateChoiceListItem, openExternalSequence,
    handleChoiceSequenceChange,
    actorIdsForSequences
}: Props) => {

    const { gameDesign: design } = useGameDesign()
    const { id, branches } = conversation

    return (<Stack spacing={2} width={500}>
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

        {/* TO DO - put in full width dialog */}
        <EditorBox title="sequence">
            {choice.choiceSequence && (
                <>
                <ButtonWithConfirm label="delete sequence" onClick={() => {
                    handleChoiceSequenceChange(undefined)
                }} />
                    <SequenceEditor
                        data={choice.choiceSequence}
                        handleChoiceSequenceChange={handleChoiceSequenceChange}
                    />
                </>
            )}

            {!choice.choiceSequence && (
                <Button
                    onClick={() => {
                        handleChoiceSequenceChange(makeBlankSequence('', actorIdsForSequences))
                    }}
                >start sequence</Button>
            )}
        </EditorBox>

        <EditorBox title="external sequence" >
            <Box flex={1} paddingTop={2.5}>
                <SelectInput
                    value={choice.sequence}
                    optional
                    options={listIds(design.sequences)}
                    label="select sequence"
                    inputHandler={(value) => {
                        handleChoiceChange(value, {
                            key: 'sequence',
                            optional: true,
                            type: 'ZodString',
                            value: choice.sequence
                        })
                    }}
                />
            </Box>
            <NewSequenceForm
                suggestedIds={[
                    `${id}-${openBranchId}-${activeChoiceIndex}`,
                ]}
                existingIds={listIds(design.sequences)}
                addSequence={addSequence}
                defaultActorIds={actorIdsForSequences}
            />
            <Button
                variant="outlined"
                disabled={!choice.sequence}
                onClick={openExternalSequence}
            >edit external sequence</Button>
        </EditorBox>
    </Stack>
    )
}