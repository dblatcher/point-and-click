import { BooleanInput, SelectInput, StringInput } from "@/components/SchemaForm/inputs";
import { useGameDesign } from "@/context/game-design-context";
import { Consequence, Interaction } from "@/definitions";
import { InteractionSchema } from "@/definitions/Interaction";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import { findTarget } from "@/lib/commandFunctions";
import { insertAt, listIds } from "@/lib/util";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, Typography } from "@mui/material";
import { useReducer, useState } from "react";
import { ArrayControl } from "../ArrayControl";
import { ButtonWithConfirm } from '../ButtonWithConfirm';
import { makeNewConsequence } from "../defaults";
import { EditorBox } from "../layout/EditorBox";
import { ClearIcon, InteractionIcon, UndoIcon } from "../material-icons";
import { MultipleSelectChip } from "../MultipleSelectChip";
import { PickConsequenceTypeDialogue } from "../PickConsequenceTypeDialogue";
import { ConsequenceCard } from "../SequenceEditor/ConsequenceCard";
import { ConsequenceDialog } from "../SequenceEditor/ConsequenceDialog";
import { FlagConditionControl } from "./FlagConditionControl";
import { getItemDescriptions, getTargetLists } from "./getTargetLists";

interface Props {
    initialInteraction: Partial<Interaction>;
    confirm: { (interaction: Interaction): void };
    cancel: { (): void }
}

type Action = {
    type: 'reset'
} | {
    type: 'update',
    mod: Partial<Interaction>
} | {
    type: 'update-consequence',
    consequence: Consequence,
    index: number,
}

type State = {
    interaction: Partial<Interaction> & { consequences: Interaction['consequences'] },
    initialValue: Partial<Interaction> & { consequences: Interaction['consequences'] },
    hasChanges: boolean
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'reset':
            return {
                ...state,
                hasChanges: false,
                interaction: state.initialValue,
            }
        case "update":
            return {
                ...state,
                hasChanges: true,
                interaction: {
                    ...state.interaction,
                    ...action.mod,
                }
            }
        case "update-consequence":
            const { index, consequence } = action;
            const { consequences } = state.interaction;
            return {
                ...state,
                hasChanges: true,
                interaction: {
                    ...state.interaction,
                    consequences: [
                        ...consequences.slice(0, index),
                        consequence,
                        ...consequences.slice(index + 1)
                    ]
                }
            }
    }
};


export const InteractionDialog = ({ initialInteraction, confirm, cancel }: Props) => {

    const [state, dispatch] = useReducer(
        reducer,
        {
            hasChanges: false,
            interaction: { ...initialInteraction, consequences: initialInteraction.consequences ?? [] },
            initialValue: { ...initialInteraction, consequences: initialInteraction.consequences ?? [] }
        }
    )
    const { interaction, hasChanges } = state;

    const [activeConsequenceIndex, setActiveConsequenceIndex] = useState<number | undefined>(undefined)
    const [insertConsequenceDialogIndex, setInsertConsequenceDialogIndex] = useState<number | undefined>(undefined)
    const [showExitDialog, setShowExitDialog] = useState(false)
    const { gameDesign } = useGameDesign()
    const { ids: targetIds, descriptions: targetDescriptions } = getTargetLists(gameDesign)
    const activeConsequence = typeof activeConsequenceIndex === 'number' ? interaction.consequences[activeConsequenceIndex] : undefined

    const updateInteraction = (mod: Partial<Interaction>) => {
        dispatch({ type: 'update', mod })
    }

    const handleConfirm = () => {
        const result = InteractionSchema.safeParse(interaction)
        if (result.success) {
            confirm(result.data)
        }
    }

    const handleClose = () => {
        if (!hasChanges) {
            return cancel()
        }
        setShowExitDialog(true)
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
        <Dialog open={true} scroll="paper" fullWidth maxWidth={'lg'} onClose={handleClose}>
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
                                        <ConsequenceCard detailed
                                            consequence={consequence}
                                            handleEditButton={() => { setActiveConsequenceIndex(index) }}
                                        />
                                    </Box>
                                )}
                                mutateList={consequences => updateInteraction({ consequences })}
                                customInsertFunction={setInsertConsequenceDialogIndex}
                            />
                        </EditorBox>
                        {activeConsequence && (
                            <ConsequenceDialog close={() => { setActiveConsequenceIndex(undefined) }}
                                consequence={activeConsequence}
                                handleConsequenceUpdate={(consequence) => dispatch({ type: 'update-consequence', consequence, index: activeConsequenceIndex ?? 0 })}
                            />
                        )}
                    </Grid>
                </Grid>
            </DialogContent >

            <DialogActions>
                <ButtonWithConfirm
                    buttonProps={{
                        startIcon: <ClearIcon />,
                        disabled: !hasChanges && parseResult.success
                    }}
                    label="Cancel Changes"
                    confirmationText="really cancel changes?"
                    onClick={cancel}
                />
                <Button onClick={() => dispatch({ type: 'reset' })}
                    disabled={!hasChanges}
                    startIcon={<UndoIcon />}
                >reset</Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={!parseResult.success}
                    title={(!parseResult.success && parseResult.error.message) || ''}
                >
                    save changes
                </Button>
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

            <Dialog open={showExitDialog} onClose={() => setShowExitDialog(false)}>
                <DialogContent>
                    <DialogContentText>
                        You have made edits to this Interaction
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-around' }}>
                    <Button onClick={cancel}>Cancel changes</Button>
                    <Button onClick={handleConfirm}>Save changes</Button>
                </DialogActions>
            </Dialog>
        </Dialog >
    )
}