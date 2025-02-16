import { BooleanInput, SelectInput, StringInput } from "@/components/SchemaForm/inputs";
import { useGameDesign } from "@/context/game-design-context";
import { Consequence, Interaction } from "@/definitions";
import { InteractionSchema } from "@/definitions/Interaction";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import { cloneData } from "@/lib/clone";
import { findTarget } from "@/lib/commandFunctions";
import { insertAt, listIds } from "@/lib/util";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { ArrayControl } from "../ArrayControl";
import { ButtonWithConfirm } from '../ButtonWithConfirm';
import { EditorBox } from "../EditorBox";
import { ConsequenceCard } from "../SequenceEditor/ConsequenceCard";
import { ConsequenceDialog } from "../SequenceEditor/ConsequenceDialog";
import { makeNewConsequence } from "../defaults";
import { InteractionIcon } from "../material-icons";
import { getItemDescriptions, getTargetLists } from "./getTargetLists";
import { FlagConditionControl } from "./FlagConditionControl";
import { PickConsequenceTypeDialogue } from "../PickConsequenceTypeDialogue";
import { MultipleSelectChip } from "../MultipleSelectChip";

interface Props {
    initialState: Partial<Interaction>;
    confirm: { (interaction: Interaction): void };
    cancelFunction: { (): void }
}

export const InteractionDialog = ({ initialState, confirm, cancelFunction }: Props) => {
    const [interaction, setInteraction] = useState<Partial<Interaction>>(cloneData(
        {
            ...initialState,
            consequences: initialState.consequences ?? []
        }))
    const [activeConsequenceIndex, setActiveConsequenceIndex] = useState<number | undefined>(undefined)
    const [insertConsequenceDialogIndex, setInsertConsequenceDialogIndex] = useState<number | undefined>(undefined)
    const { gameDesign } = useGameDesign()
    const { ids: targetIds, descriptions: targetDescriptions } = getTargetLists(gameDesign)
    const activeConsequence = typeof activeConsequenceIndex === 'number' ? interaction.consequences?.[activeConsequenceIndex] : undefined

    const updateInteraction = (mod: Partial<Interaction>) => {
        console.log('update', mod)
        setInteraction({ ...interaction, ...mod })
    }

    const updateConsequence = (consequence: Consequence, index: number) => {
        const { consequences = [] } = interaction
        consequences.splice(index, 1, consequence)
        setInteraction({ ...interaction, consequences })
    }

    const handleConfirm = () => {
        const result = InteractionSchema.safeParse(interaction)
        if (result.success) {
            confirm(result.data)
        }
    }

    const handleReset = () => {
        setInteraction(cloneData({
            ...initialState,
            consequences: initialState.consequences ?? []
        }))
    }

    const dialogTitle = () => {
        if (!interaction) { return '' }
        const { verbId = '[VERB]', targetId = '[TARGET]', itemId } = interaction
        return `${verbId} ${targetId} ${itemId ? `with ${itemId}` : ''}`
    }

    const verb = gameDesign.verbs.find(_ => _.id === interaction.verbId);
    const showItemOption = verb?.preposition
    const { consequences = [] } = interaction
    const parseResult = InteractionSchema.safeParse(interaction)

    const statusSuggestions: string[] = []
    const target = findTarget(interaction, gameDesign);
    if (target?.type === 'actor') {
        statusSuggestions.push(...getStatusSuggestions(target.id, gameDesign));
    }

    return (
        <Dialog open={true} scroll="paper" fullWidth maxWidth={'lg'}>
            <DialogTitle sx={{ alignItems: 'center', display: 'flex' }}>
                <InteractionIcon />
                Edit Interaction: {dialogTitle()}
            </DialogTitle>
            <DialogContent>
                <EditorBox title="Command">
                    <Stack direction={'row'}
                        alignItems={'center'} spacing={2}
                        padding={1}
                    >
                        <SelectInput
                            label="VERB"
                            optional
                            inputHandler={(verbId: string | undefined) => { updateInteraction({ verbId }) }}
                            value={interaction.verbId || ''}
                            options={listIds(gameDesign.verbs)} />

                        {showItemOption && <>
                            <SelectInput
                                label="ITEM"
                                optional
                                inputHandler={(itemId: string | undefined) => { updateInteraction({ itemId }) }}
                                value={interaction.itemId || ''}
                                options={listIds(gameDesign.items)} descriptions={getItemDescriptions(gameDesign)} />
                            <Typography>{verb?.preposition}</Typography>
                        </>}

                        <SelectInput
                            label="TARGET"
                            optional
                            inputHandler={(targetId: string | undefined) => { updateInteraction({ targetId }) }}
                            value={interaction.targetId || ''}
                            options={targetIds}
                            descriptions={targetDescriptions} />
                    </Stack>
                </EditorBox>

                <Grid container>
                    <Grid item xs={6}>
                        <EditorBox title="Conditions">
                            <Stack spacing={2} paddingBottom={2}>
                                <SelectInput
                                    label="Room must be:"
                                    optional
                                    inputHandler={(roomId: string | undefined) => { updateInteraction({ roomId }) }}
                                    value={interaction.roomId || ''}
                                    options={listIds(gameDesign.rooms)} />
                                <StringInput
                                    label="Target status must be"
                                    inputHandler={(targetStatus) => { updateInteraction({ targetStatus }) }}
                                    value={interaction.targetStatus || ''}
                                    suggestions={statusSuggestions}
                                />
                                <BooleanInput
                                    label="Must reach target first?"
                                    inputHandler={(mustReachFirst) => { updateInteraction({ mustReachFirst }) }}
                                    value={!!interaction.mustReachFirst}
                                />

                                <MultipleSelectChip
                                    label="Required inventory items"
                                    options={gameDesign.items.map(item => item)}
                                    selectedOptionIds={interaction.requiredInventory ?? []}
                                    setSelectedOptionIds={requiredInventory => updateInteraction({ requiredInventory })}
                                    idBase="required-inventory"
                                />

                            </Stack>
                        </EditorBox>
                        <FlagConditionControl interaction={interaction} updateInteraction={updateInteraction} />
                    </Grid>
                    <Grid item xs={6}>
                        <EditorBox title="Consequences"
                            boxProps={{ height: '100%', boxSizing: 'border-box', position: 'relative', display: 'flex', flexDirection: 'column' }}
                            contentBoxProps={{ flex: 1, sx: { paddingY: 4, paddingX: 3 } }}
                        >
                            <ArrayControl
                                list={consequences}
                                createButtonPlacement="END"
                                noMoveButtons={true}
                                describeItem={(consequence, index) => (
                                    <Box paddingBottom={1}>
                                        <ConsequenceCard
                                            consequence={consequence}
                                            handleEditButton={() => { setActiveConsequenceIndex(index) }}
                                        />
                                    </Box>
                                )}
                                mutateList={consequences => updateInteraction({ consequences })}
                                customInsertFunction={(index) => {
                                    setInsertConsequenceDialogIndex(index)
                                }}
                            />
                        </EditorBox>
                        {activeConsequence && (
                            <ConsequenceDialog close={() => { setActiveConsequenceIndex(undefined) }}
                                consequence={activeConsequence}
                                handleConsequenceUpdate={(consequence) => { updateConsequence(consequence, activeConsequenceIndex ?? 0) }}
                            />
                        )}
                    </Grid>
                </Grid>
            </DialogContent >

            <DialogActions>
                <ButtonWithConfirm label="Cancel Changes" confirmationText="really cancel changes?"
                    onClick={cancelFunction}
                />
                <Button onClick={handleReset}>RESET CHANGES</Button>
                <Button
                    onClick={handleConfirm}
                    disabled={!parseResult.success}
                    title={(!parseResult.success && parseResult.error.message) || ''}
                >SAVE CHANGES</Button>
            </DialogActions>

            <PickConsequenceTypeDialogue
                open={typeof insertConsequenceDialogIndex === 'number'}
                onClose={() => setInsertConsequenceDialogIndex(undefined)}
                handleChoice={type => {
                    if (typeof insertConsequenceDialogIndex === 'number') {
                        updateInteraction({ consequences: insertAt(insertConsequenceDialogIndex, makeNewConsequence(type), interaction.consequences ?? []) })
                        setActiveConsequenceIndex(insertConsequenceDialogIndex)
                    }
                    setInsertConsequenceDialogIndex(undefined)
                }} />

        </Dialog >
    )
}