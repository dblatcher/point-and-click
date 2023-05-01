import { FunctionComponent, useState } from "react";
import { GameDesign, Interaction, AnyConsequence, Consequence } from "@/oldsrc";
import { InteractionSchema } from "@/definitions/Interaction";
import { cloneData } from "@/lib/clone";
import { listIds } from "@/lib/util";
import { findTarget } from "@/lib/commandFunctions";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import { CheckBoxInput, SelectAndConfirmInput, SelectInput, StringInput } from "../formControls";
import { ButtonWithConfirm } from '../ButtonWithConfirm'
import { makeNewConsequence } from "../defaults";
import { getItemDescriptions, getTargetLists } from "./getTargetLists";
import { ListEditor } from "../ListEditor";
import { ConsequenceForm } from "./ConsequenceForm";
import { icons } from "../dataEditors";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, ButtonGroup, ThemeProvider } from "@mui/material";
import { defaultTheme } from "@/theme";

interface Props {
    initialState: Partial<Interaction>;
    gameDesign: GameDesign;
    confirm: { (interaction: Interaction): void };
    cancelFunction: { (): void }
}


export const InteractionForm: FunctionComponent<Props> = ({ initialState, gameDesign, confirm, cancelFunction }: Props) => {

    const [interaction, setInteraction] = useState<Partial<Interaction>>(Object.assign({ consequences: [] }, cloneData(initialState)))
    const { ids: targetIds, descriptions: targetDescriptions } = getTargetLists(gameDesign)

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
        <ThemeProvider theme={defaultTheme}>
            <Dialog open={true} scroll="paper" fullWidth maxWidth={'lg'}>
                <DialogTitle>Edit Interactions: {dialogTitle()}</DialogTitle>
                <DialogContent>

                    <fieldset>
                        <legend>command</legend>
                        <SelectInput
                            haveEmptyOption={true}
                            onSelect={(verbId: string) => { setInteractionProperty('verbId', verbId) }}
                            emptyOptionLabel="(choose verb)"
                            value={interaction.verbId || ''}
                            items={listIds(gameDesign.verbs)} />

                        {showItemOption && <>
                            <SelectInput
                                haveEmptyOption={true}
                                onSelect={(itemId: string) => { setInteractionProperty('itemId', itemId) }}
                                emptyOptionLabel="(choose item)"
                                value={interaction.itemId || ''}
                                items={listIds(gameDesign.items)} descriptions={getItemDescriptions(gameDesign)} />
                            <span> {verb?.preposition} </span>
                        </>}

                        <SelectInput
                            haveEmptyOption={true}
                            onSelect={(targetId: string) => { setInteractionProperty('targetId', targetId) }}
                            emptyOptionLabel="(choose target)"
                            value={interaction.targetId || ''}
                            items={targetIds}
                            descriptions={targetDescriptions} />
                    </fieldset>

                    <fieldset>
                        <legend>conditions</legend>
                        <div>
                            <SelectInput
                                label="Must be in"
                                haveEmptyOption={true}
                                onSelect={(roomId: string) => { setInteractionProperty('roomId', roomId) }}
                                emptyOptionLabel="(choose room)"
                                value={interaction.roomId || ''}
                                items={listIds(gameDesign.rooms)} />
                        </div>
                        <div>
                            <StringInput
                                label="Target status must be"
                                inputHandler={(value) => { setInteractionProperty('targetStatus', value) }}
                                value={interaction.targetStatus || ''}
                                suggestions={statusSuggestions}
                            />
                        </div>
                        <div>
                            <CheckBoxInput
                                label="Must reach target first?"
                                inputHandler={(value) => { setInteractionProperty('mustReachFirst', value) }}
                                value={interaction.mustReachFirst}
                            />
                        </div>
                        <div style={{ display: 'flex' }}>
                            <fieldset>

                                <legend>Flags that must be false[{interaction.flagsThatMustBeFalse?.length || 0}]</legend>
                                <ListEditor noMoveButtons
                                    list={interaction.flagsThatMustBeFalse || []}
                                    describeItem={(item, index) => (
                                        <span key={index}>{item}</span>
                                    )}
                                    mutateList={value => setInteractionProperty('flagsThatMustBeFalse', value)}
                                />
                                <SelectAndConfirmInput
                                    label="ADD"
                                    items={Object.keys(gameDesign.flagMap).filter(id => !interaction.flagsThatMustBeFalse?.includes(id))}
                                    onSelect={flagId => {
                                        if (flagId.length === 0) { return }
                                        const newList = [...interaction.flagsThatMustBeFalse || [], flagId]
                                        setInteractionProperty('flagsThatMustBeFalse', newList)
                                    }}
                                />
                            </fieldset>

                            <fieldset>
                                <legend>Flags that must be true[{interaction.flagsThatMustBeTrue?.length || 0}]</legend>
                                <ListEditor noMoveButtons
                                    list={interaction.flagsThatMustBeTrue || []}
                                    describeItem={(item, index) => (
                                        <span key={index}>{item}</span>
                                    )}
                                    mutateList={value => setInteractionProperty('flagsThatMustBeTrue', value)}
                                />
                                <SelectAndConfirmInput
                                    label="ADD"
                                    items={Object.keys(gameDesign.flagMap).filter(id => !interaction.flagsThatMustBeTrue?.includes(id))}
                                    onSelect={flagId => {
                                        if (flagId.length === 0) { return }
                                        const newList = [...interaction.flagsThatMustBeTrue || [], flagId]
                                        setInteractionProperty('flagsThatMustBeTrue', newList)
                                    }}
                                />
                            </fieldset>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>consequences</legend>

                        <ListEditor
                            list={consequences}
                            heavyBorders={true}
                            createButton="END"
                            noMoveButtons={true}
                            describeItem={(consequence, index) => (
                                <ConsequenceForm
                                    consequence={consequence as AnyConsequence}
                                    update={(consequence) => { updateConsequence(consequence, index) }}
                                    gameDesign={gameDesign} />
                            )}
                            mutateList={newConsequences => {
                                interaction.consequences = newConsequences
                                setInteraction(Object.assign({}, interaction))
                            }}
                            createItem={() => makeNewConsequence('order')}
                            insertText={`${icons.INSERT} ADD NEW CONSEQUENCE`}
                            deleteText={`${icons.DELETE} REMOVE CONSEQUENCE`}
                        />
                    </fieldset>

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
        </ThemeProvider>
    )
}