import { BooleanInput, SelectInput, StringInput } from "@/components/SchemaForm/inputs";
import { Consequence, GameDesign, Interaction } from "@/definitions";
import { InteractionSchema } from "@/definitions/Interaction";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import { cloneData } from "@/lib/clone";
import { findTarget } from "@/lib/commandFunctions";
import { listIds } from "@/lib/util";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { ArrayControl } from "../ArrayControl";
import { ButtonWithConfirm } from '../ButtonWithConfirm';
import { EditorBox } from "../EditorBox";
import { SelectAndConfirm } from "../SelectAndConfirm";
import { ConsequenceCard } from "../SequenceEditor/ConsequenceCard";
import { ConsequenceDialog } from "../SequenceEditor/ConsequenceDialog";
import { makeNewConsequence } from "../defaults";
import { getItemDescriptions, getTargetLists } from "./getTargetLists";

interface Props {
    initialState: Partial<Interaction>;
    gameDesign: GameDesign;
    confirm: { (interaction: Interaction): void };
    cancelFunction: { (): void }
}

export const InteractionDialog = ({ initialState, gameDesign, confirm, cancelFunction }: Props) => {

    const [interaction, setInteraction] = useState<Partial<Interaction>>(Object.assign({ consequences: [] }, cloneData(initialState)))
    const [activeConsequenceIndex, setActiveConsequenceIndex] = useState<number | undefined>(undefined)
    const { ids: targetIds, descriptions: targetDescriptions } = getTargetLists(gameDesign)

    const activeConsequence = typeof activeConsequenceIndex === 'number' ? interaction.consequences?.[activeConsequenceIndex] : undefined

    const setInteractionProperty = (property: keyof Interaction, value: unknown) => {
        const modification: Partial<Interaction> = {}
        switch (property) {
            case 'verbId':
            case 'targetId':
            case 'targetStatus':
            case 'itemId':
            case 'roomId':
                {
                    modification[property] = value as string;
                    break;
                }
            case 'mustReachFirst':
                {
                    modification[property] = value as boolean;
                    break;
                }
            case 'flagsThatMustBeFalse':
            case 'flagsThatMustBeTrue':
                {
                    modification[property] = value as string[];
                    break
                }
        }
        setInteraction(Object.assign({}, interaction, modification))
    }

    const updateConsequence = (consequence: Consequence, index: number) => {
        const { consequences = [] } = interaction
        consequences.splice(index, 1, consequence)
        setInteraction(Object.assign({}, interaction, { consequences }))
    }

    const handleConfirm = () => {
        const result = InteractionSchema.safeParse(interaction)
        if (result.success) {
            confirm(result.data)
        }
    }

    const handleReset = () => {
        setInteraction(Object.assign({ consequences: [] }, cloneData(initialState)))
    }

    const dialogTitle = () => {
        if (!interaction) { return '' }
        const { verbId, targetId, itemId } = interaction
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
            <DialogTitle>Edit Interactions: {dialogTitle()}</DialogTitle>
            <DialogContent>
                <EditorBox title="Command">
                    <Stack direction={'row'}
                        alignItems={'center'} spacing={2}
                        padding={1}
                    >
                        <SelectInput
                            label="VERB"
                            optional
                            inputHandler={(verbId: string | undefined) => { setInteractionProperty('verbId', verbId) }}
                            value={interaction.verbId || ''}
                            options={listIds(gameDesign.verbs)} />

                        {showItemOption && <>
                            <SelectInput
                                label="ITEM"
                                optional
                                inputHandler={(itemId: string | undefined) => { setInteractionProperty('itemId', itemId) }}
                                value={interaction.itemId || ''}
                                options={listIds(gameDesign.items)} descriptions={getItemDescriptions(gameDesign)} />
                            <Typography>{verb?.preposition}</Typography>
                        </>}

                        <SelectInput
                            label="TARGET"
                            optional
                            inputHandler={(targetId: string | undefined) => { setInteractionProperty('targetId', targetId) }}
                            value={interaction.targetId || ''}
                            options={targetIds}
                            descriptions={targetDescriptions} />
                    </Stack>
                </EditorBox>

                <EditorBox title="Conditions">
                    <Grid container>
                        <Grid item padding={1} borderRight={1}>
                            <Stack spacing={2}>
                                <SelectInput
                                    label="Room must be:"
                                    optional
                                    inputHandler={(roomId: string | undefined) => { setInteractionProperty('roomId', roomId) }}
                                    value={interaction.roomId || ''}
                                    options={listIds(gameDesign.rooms)} />
                                <StringInput
                                    label="Target status must be"
                                    inputHandler={(value) => { setInteractionProperty('targetStatus', value) }}
                                    value={interaction.targetStatus || ''}
                                    suggestions={statusSuggestions}
                                />
                                <BooleanInput
                                    label="Must reach target first?"
                                    inputHandler={(value) => { setInteractionProperty('mustReachFirst', value) }}
                                    value={!!interaction.mustReachFirst}
                                />
                            </Stack>
                        </Grid>

                        <Grid item padding={1} borderRight={1}>
                            <Typography variant="caption">
                                Flags that must be false[{interaction.flagsThatMustBeFalse?.length || 0}]
                            </Typography>
                            <SelectAndConfirm
                                boxProps={{ minWidth: 200, display: 'flex', alignItems: 'flex-end' }}
                                options={Object.keys(gameDesign.flagMap).filter(id => !interaction.flagsThatMustBeFalse?.includes(id))}
                                inputHandler={flagId => {
                                    if (flagId.length === 0) { return }
                                    const newList = [...interaction.flagsThatMustBeFalse || [], flagId]
                                    setInteractionProperty('flagsThatMustBeFalse', newList)
                                }}
                            />
                            <ArrayControl noMoveButtons buttonSize="small"
                                list={interaction.flagsThatMustBeFalse || []}
                                describeItem={(item, index) => (
                                    <Typography key={index}>{item}</Typography>
                                )}
                                mutateList={value => setInteractionProperty('flagsThatMustBeFalse', value)}
                            />
                        </Grid>

                        <Grid item padding={1}>
                            <Typography variant="caption">
                                Flags that must be true[{interaction.flagsThatMustBeTrue?.length || 0}]
                            </Typography>
                            <SelectAndConfirm
                                boxProps={{ minWidth: 200, display: 'flex', alignItems: 'flex-end' }}
                                options={Object.keys(gameDesign.flagMap).filter(id => !interaction.flagsThatMustBeTrue?.includes(id))}
                                inputHandler={flagId => {
                                    if (flagId.length === 0) { return }
                                    const newList = [...interaction.flagsThatMustBeTrue || [], flagId]
                                    setInteractionProperty('flagsThatMustBeTrue', newList)
                                }}
                            />
                            <ArrayControl noMoveButtons buttonSize="small"
                                list={interaction.flagsThatMustBeTrue || []}
                                describeItem={(item, index) => (
                                    <Typography key={index}>{item}</Typography>
                                )}
                                mutateList={value => setInteractionProperty('flagsThatMustBeTrue', value)}
                            />
                        </Grid>
                    </Grid>
                </EditorBox>

                <EditorBox title="Consequences">
                    <ArrayControl
                        list={consequences}
                        createButton="END"
                        noMoveButtons={true}
                        describeItem={(consequence, index) => (
                            <Box paddingBottom={1}>
                                <ConsequenceCard
                                    consequence={consequence}
                                    handleEditButton={() => { setActiveConsequenceIndex(index) }}
                                />
                            </Box>
                        )}
                        mutateList={newConsequences => {
                            interaction.consequences = newConsequences
                            setInteraction(Object.assign({}, interaction))
                        }}
                        createItem={() => makeNewConsequence('order')}
                        insertText={`ADD NEW CONSEQUENCE`}
                        deleteText={`REMOVE CONSEQUENCE`}
                    />
                </EditorBox>
                {activeConsequence && (
                    <ConsequenceDialog close={() => { setActiveConsequenceIndex(undefined) }}
                        consequence={activeConsequence}
                        handleConsequenceUpdate={(consequence) => { updateConsequence(consequence, activeConsequenceIndex ?? 0) }}
                    />
                )}
            </DialogContent>

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
        </Dialog>
    )
}