import { BooleanInput, SelectInput, StringInput } from "@/components/SchemaForm/inputs";
import { useGameDesign } from "@/context/game-design-context";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import { findById, insertAt, listIds, replaceAt } from "@/lib/util";
import { editorTheme } from "@/theme";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, ThemeProvider, Typography } from "@mui/material";
import { Consequence, Interaction, findTarget } from "point-click-lib";
import { ReactNode, useEffect, useState } from "react";
import { ArrayControl } from "../ArrayControl";
import { makeNewConsequence } from "../defaults";
import { UndoAndRedoButtons } from "../HistoryButtons";
import { EditorBox } from "../layout/EditorBox";
import { InteractionIcon } from "../material-icons";
import { MultipleSelectChip } from "../MultipleSelectChip";
import { PickConsequenceTypeDialogue } from "../PickConsequenceTypeDialogue";
import { ConsequenceCard } from "../SequenceEditor/ConsequenceCard";
import { ConsequenceDialog } from "../SequenceEditor/ConsequenceDialog";
import { DialogTutorial } from "../tutorial/sections";
import { FlagConditionControl } from "./FlagConditionControl";
import { getItemDescriptions, getTargetLists } from "./getTargetLists";


const DialogFrame = ({ children, interaction }: { children: ReactNode, interaction?: Interaction }) => {
    const { dispatchDesignUpdate } = useGameDesign()

    const dialogTitle = () => {
        if (!interaction) { return '' }
        const { verbId = '[VERB]', targetId = '[TARGET]', itemId } = interaction
        return `${verbId} ${targetId} ${itemId ? `with ${itemId}` : ''}`
    }

    useEffect(() => {
        if (!interaction) { () => dispatchDesignUpdate({ type: 'close-interaction' }) }
    }, [interaction, dispatchDesignUpdate])

    return (
        <Dialog open={true} scroll="paper" fullWidth maxWidth={'lg'} onClose={() => dispatchDesignUpdate({ type: 'close-interaction' })
        }>
            <DialogTitle sx={{ alignItems: 'center', display: 'flex' }}>
                <InteractionIcon />
                Edit Interaction: {dialogTitle()}
            </DialogTitle>
            {children}
            <DialogActions>
                <UndoAndRedoButtons />
                <Button
                    sx={{ marginLeft: 8 }}
                    onClick={() => dispatchDesignUpdate({ type: 'close-interaction' })}
                    variant="contained"
                >
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export const InteractionDialog = () => {
    const { interactionIndex, gameDesign, changeOrAddInteraction } = useGameDesign()
    const interaction = typeof interactionIndex === 'number' ? gameDesign.interactions[interactionIndex] : undefined
    const [activeConsequenceIndex, setActiveConsequenceIndex] = useState<number | undefined>(undefined)
    const [insertConsequenceDialogIndex, setInsertConsequenceDialogIndex] = useState<number | undefined>(undefined)

    const updateInteraction = (mod: Partial<Interaction>) => {
        if (!interaction) {
            return
        }
        changeOrAddInteraction({
            ...interaction,
            ...mod
        }, interactionIndex)
    }

    const updateConsequence = (consequence: Consequence) => {
        updateInteraction({
            consequences: replaceAt(activeConsequenceIndex ?? 0, consequence, interaction?.consequences ?? [])
        })
    }

    if (!interaction) {
        return (
            <DialogFrame interaction={interaction}>
                <DialogContent>
                    Missing {interactionIndex}
                </DialogContent>
            </DialogFrame>
        )
    }

    const verb = findById(interaction.verbId, gameDesign.verbs);
    const showItemOption = verb?.preposition
    const { consequences } = interaction
    const target = findTarget(interaction, gameDesign);
    const statusSuggestions = target?.type === 'actor' ? getStatusSuggestions(target.id, gameDesign) : []
    const { ids: targetIds, descriptions: targetDescriptions } = getTargetLists(gameDesign)
    const activeConsequence = typeof activeConsequenceIndex === 'number' ? interaction?.consequences[activeConsequenceIndex] : undefined

    return (
        <DialogFrame interaction={interaction}>
            <DialogContent>
                <DialogTutorial />
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
                                    label="allowed player"
                                    options={gameDesign.actors.filter(actor => typeof actor.canBePlayer === 'boolean').map(item => item)}
                                    selectedOptionIds={interaction.allowedPlayerIds ?? []}
                                    setSelectedOptionIds={allowedPlayerIds => updateInteraction({ allowedPlayerIds })}
                                    idBase="allowed-players"
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
                                handleConsequenceUpdate={updateConsequence}
                            />
                        )}
                    </Grid>
                </Grid>
            </DialogContent >
            <PickConsequenceTypeDialogue
                open={typeof insertConsequenceDialogIndex === 'number'}
                onClose={() => setInsertConsequenceDialogIndex(undefined)}
                handleChoice={type => {
                    if (typeof insertConsequenceDialogIndex === 'number') {
                        updateInteraction({ consequences: insertAt(insertConsequenceDialogIndex, makeNewConsequence(type), interaction.consequences) })
                        setActiveConsequenceIndex(insertConsequenceDialogIndex)
                    }
                    setInsertConsequenceDialogIndex(undefined)
                }} />
        </DialogFrame >
    )
}