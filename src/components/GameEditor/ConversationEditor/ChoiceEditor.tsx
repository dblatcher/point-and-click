import { SchemaForm } from "@/components/SchemaForm"
import { SelectInput } from "@/components/SchemaForm/SelectInput"
import { useGameDesign } from "@/context/game-design-context"
import { DEFAULT_TALK_TIME } from "@/lib/types-and-constants"
import { listIds } from "@/lib/util"
import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, Typography } from "@mui/material"
import { ChoiceRefSet, Conversation, ConversationChoice, ConversationChoiceSchema, SayOrder, Sequence } from "point-click-lib"
import { useState } from "react"
import { ButtonWithConfirm } from "../ButtonWithConfirm"
import { HelpButton } from "../HelpButton"
import { SequenceEditor } from "../SequenceEditor"
import { makeBlankSequence } from "../defaults"
import { DeleteIcon } from "../material-icons"
import { ChoiceListControl } from "./ChoiceListControl"


interface Props {
    choice: ConversationChoice
    conversation: Conversation
    openBranchId: string,
    handleChoiceUpdate: { (mod: Partial<ConversationChoice>): void };
    addChoiceListItem: { (property: 'enablesChoices' | 'disablesChoices'): void };
    removeChoiceListItem: { (property: 'enablesChoices' | 'disablesChoices', index: number): void };
    updateChoiceListItem: {
        (property: 'enablesChoices' | 'disablesChoices',
            indexOfSet: number,
            newRefSet: ChoiceRefSet): void
    };
    actorIdsForSequences: string[];
}

export const ChoiceEditor = ({
    choice, conversation, openBranchId,
    addChoiceListItem, removeChoiceListItem, updateChoiceListItem,
    handleChoiceUpdate,
    actorIdsForSequences
}: Props) => {

    const [sequenceDialogOpen, setSequenceDialogOpen] = useState(false)
    const { gameDesign: design } = useGameDesign()
    const { id, branches } = conversation

    const makeSequenceForChoice = (): Sequence => {
        const sequence = makeBlankSequence('', actorIdsForSequences)
        const player = design.actors.find(a => a.isPlayer)
        const firstStage = sequence.stages[0]
        if (player && firstStage) {
            const orderToSayConversationText: SayOrder = {
                type: 'say',
                text: choice.text,
                time: DEFAULT_TALK_TIME,
            }
            if (!firstStage.actorOrders) {
                firstStage.actorOrders = {}
            }
            firstStage.actorOrders[player.id] = [orderToSayConversationText]
        }
        return sequence
    }

    return (<Stack spacing={2} width={500}>
        <SchemaForm
            textInputDelay={2000}
            schema={ConversationChoiceSchema.omit({
                'sequence': true,
                'enablesChoices': true,
                'disablesChoices': true,
                'choiceSequence': true
            })}
            data={choice}
            changeValue={handleChoiceUpdate}
            options={{
                nextBranch: Object.keys(branches),
            }}
            fieldAliases={{
                nextBranch: 'changes branch to:',
                once: 'can use only once',
                disabled: 'starts disabled',
                end: 'ends conversation',
            }}
        />

        <Divider textAlign="left">
            <Stack direction={'row'} alignItems={'center'}>
                <Typography fontWeight={700}>resulting sequence</Typography>
                <HelpButton helpTopic="conversation choice sequences" />
            </Stack>
        </Divider>

        <ButtonGroup>
            {choice.choiceSequence ? (
                <>
                    <Button
                        variant="outlined"
                        disabled={!!choice.sequence}
                        onClick={() => { setSequenceDialogOpen(true) }}>
                        edit sequence ({choice.choiceSequence?.stages.length} stages)
                    </Button>
                    <ButtonWithConfirm label="delete sequence"
                        buttonProps={{
                            variant: 'outlined',
                            color: 'warning',
                            startIcon: <DeleteIcon />,
                        }}
                        onClick={() => {
                            handleChoiceUpdate({ choiceSequence: undefined })
                        }} />
                </>
            ) : (<>
                <Button
                    variant="outlined"
                    onClick={() => {
                        handleChoiceUpdate({ choiceSequence: makeSequenceForChoice() })
                    }}
                >create sequence(player says text)</Button>
                <Button
                    variant="outlined"
                    onClick={() => {
                        handleChoiceUpdate({ choiceSequence: makeBlankSequence('', actorIdsForSequences) })
                    }}
                >create sequence(blank)</Button>
            </>
            )}
        </ButtonGroup>

        <Box flex={1} paddingTop={2.5}>
            <SelectInput
                value={choice.sequence}
                optional
                options={listIds(design.sequences)}
                label="use external sequence:"
                inputHandler={(value) => {
                    handleChoiceUpdate({ sequence: value })
                }}
            />
        </Box>
        <Divider textAlign="left"><Typography fontWeight={700}>effect on other choices</Typography></Divider>

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

        <Dialog
            open={!!sequenceDialogOpen}
            onClose={() => { setSequenceDialogOpen(false) }}
            maxWidth={'xl'}
            fullWidth
        >
            <DialogTitle>
                <Typography>Sequence: <q>{choice.text}</q></Typography>
            </DialogTitle>
            <DialogContent>
                {choice.choiceSequence && (
                    <SequenceEditor
                        data={choice.choiceSequence}
                        handleChoiceSequenceChange={(sequence) => handleChoiceUpdate({ choiceSequence: sequence })}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={() => { setSequenceDialogOpen(false) }}>close</Button>
            </DialogActions>
        </Dialog>


    </Stack>
    )
}