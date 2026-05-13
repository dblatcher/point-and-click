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
        if (!interaction) {
            dispatchDesignUpdate({ type: 'set-interaction-index' })
        }
    }, [interaction, dispatchDesignUpdate])

    return (
        <Dialog open={true} scroll="paper" fullWidth maxWidth={'lg'} onClose={() => dispatchDesignUpdate({ type: 'set-interaction-index' })
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
                    onClick={() => dispatchDesignUpdate({ type: 'set-interaction-index' })}
                    variant="contained"
                >
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export const InteractionDialog = () => {
    const { interactionIndex, gameDesign, dispatchDesignUpdate } = useGameDesign()
    const interaction = typeof interactionIndex === 'number' ? gameDesign.interactions[interactionIndex] : undefined
    const [activeConsequenceIndex, setActiveConsequenceIndex] = useState<number | undefined>(undefined)
    const [insertConsequenceDialogIndex, setInsertConsequenceDialogIndex] = useState<number | undefined>(undefined)

    const updateInteraction = (mod: Partial<Interaction>, description: string) => {
        if (!interaction || typeof interactionIndex === 'undefined') {
            return
        }
        dispatchDesignUpdate({
            type: 'modify-interaction',
            data: { ...interaction, ...mod },
            index: interactionIndex,
            description,
        })
    }

    const updateConsequence = (consequence: Consequence) => {
        updateInteraction(
            { consequences: replaceAt(activeConsequenceIndex ?? 0, consequence, interaction?.consequences ?? []) },
            "change consequence"
        )
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
                            inputHandler={(verbId: string | undefined) => { updateInteraction({ verbId }, `set verb to ${verbId}`) }}
                            value={interaction.verbId || ''}
                            options={listIds(gameDesign.verbs)} />

                        {showItemOption && <>
                            <SelectInput
                                label="ITEM"
                                optional
                                inputHandler={(itemId: string | undefined) => { updateInteraction({ itemId }, `set item to ${itemId}`) }}
                                value={interaction.itemId || ''}
                                options={listIds(gameDesign.items)} descriptions={getItemDescriptions(gameDesign)} />
                            <Typography>{verb?.preposition}</Typography>
                        </>}

                        <SelectInput
                            label="TARGET"
                            optional
                            inputHandler={(targetId: string | undefined) => { updateInteraction({ targetId }, `set target to ${targetId}`) }}
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
                                    inputHandler={(roomId: string | undefined) => { updateInteraction({ roomId }, `room must be ${roomId}`) }}
                                    value={interaction.roomId || ''}
                                    options={listIds(gameDesign.rooms)} />
                                <StringInput
                                    label="Target status must be"
                                    inputHandler={(targetStatus) => { updateInteraction({ targetStatus }, `targetStatus must be ${targetStatus}`) }}
                                    value={interaction.targetStatus || ''}
                                    suggestions={statusSuggestions}
                                />
                                <BooleanInput
                                    label="Must reach target first?"
                                    inputHandler={(mustReachFirst) => { updateInteraction({ mustReachFirst }, `must reach first: ${mustReachFirst.toString()}`) }}
                                    value={!!interaction.mustReachFirst}
                                />
                                <MultipleSelectChip
                                    label="allowed player"
                                    options={gameDesign.actors.filter(actor => typeof actor.canBePlayer === 'boolean').map(item => item)}
                                    selectedOptionIds={interaction.allowedPlayerIds ?? []}
                                    setSelectedOptionIds={allowedPlayerIds => updateInteraction({ allowedPlayerIds }, `restricted to ${allowedPlayerIds.join()}`)}
                                    idBase="allowed-players"
                                />
                                <MultipleSelectChip
                                    label="Required inventory items"
                                    options={gameDesign.items.map(item => item)}
                                    selectedOptionIds={interaction.requiredInventory ?? []}
                                    setSelectedOptionIds={requiredInventory => updateInteraction({ requiredInventory }, `required inventory: ${requiredInventory.join()}`)}
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
                                mutateList={consequences => updateInteraction({ consequences }, `change consequences`)}
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
                        updateInteraction(
                            { consequences: insertAt(insertConsequenceDialogIndex, makeNewConsequence(type), interaction.consequences) },
                            `add ${type} consequence`
                        )
                        setActiveConsequenceIndex(insertConsequenceDialogIndex)
                    }
                    setInsertConsequenceDialogIndex(undefined)
                }} />
        </DialogFrame >
    )
}