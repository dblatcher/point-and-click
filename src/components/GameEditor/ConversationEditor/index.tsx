
import { getModification, type FieldDef, type FieldValue } from "@/components/SchemaForm";
import { SelectInput, StringInput } from "@/components/SchemaForm/inputs";
import { GameDesign, Sequence } from "@/definitions";
import { ChoiceRefSet, Conversation, ConversationBranch, ConversationChoice, ConversationSchema } from "@/definitions/Conversation";
import { cloneData } from "@/lib/clone";
import { uploadJsonData } from "@/lib/files";
import { findById, listIds } from "@/lib/util";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import { Component } from "react";
import { EditorBox } from "../EditorBox";
import { EditorHeading } from "../EditorHeading";
import { ListEditor } from "../ListEditor";
import { SequenceEditor } from "../SequenceEditor";
import { StorageMenu } from "../StorageMenu";
import { DataItemEditorProps } from "../dataEditors";
import { makeBlankConversation, makeBlankConversationChoice } from "../defaults";
import { ChoiceDescription } from "./ChoiceDescription";
import { ChoiceEditor } from "./ChoiceEditor";
import { ConversationFlow } from "./ConversationFlow";

type ExtraState = {
    openBranchId?: string;
    activeChoiceIndex?: number;
    sequenceDialogOpen?: boolean;
    editOrderDialogBranchId?: string;
}

type State = Conversation & ExtraState;

type Props = DataItemEditorProps<Conversation> & {
    conversations: Conversation[];
    sequenceIds: string[];
    gameDesign: GameDesign;
    updateSequenceData: { (data: Sequence): void };
}

export class ConversationEditor extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        const initialState = props.data ? cloneData(props.data) : makeBlankConversation()
        this.state = {
            ...initialState,
            openBranchId: undefined,
            activeChoiceIndex: 0,
            sequenceDialogOpen: false,
        }

        this.handleLoadButton = this.handleLoadButton.bind(this)
        this.handleResetButton = this.handleResetButton.bind(this)
        this.handleUpdateButton = this.handleUpdateButton.bind(this)
        this.handleChoiceChange = this.handleChoiceChange.bind(this)
        this.updateChoiceListItem = this.updateChoiceListItem.bind(this)
        this.addChoiceListItem = this.addChoiceListItem.bind(this)
        this.removeChoiceListItem = this.removeChoiceListItem.bind(this)
        this.addSequence = this.addSequence.bind(this)
        this.addNewBranch = this.addNewBranch.bind(this)
        this.addNewChoice = this.addNewChoice.bind(this)
        this.changeBranch = this.changeBranch.bind(this)
        this.mutateChoiceList = this.mutateChoiceList.bind(this)

        this.setStateWithAutosave = this.setStateWithAutosave.bind(this)
    }

    get currentData(): Conversation {
        const conversation = cloneData(this.state) as State;
        delete conversation.openBranchId
        delete conversation.activeChoiceIndex
        delete conversation.sequenceDialogOpen
        delete conversation.editOrderDialogBranchId
        return conversation
    }

    setStateWithAutosave(input: Partial<State> | { (state: State): Partial<State> }, callback?: { (): void }) {
        const { options, data, updateData, conversations } = this.props

        if (!options.autoSave) {
            return this.setState(input, callback)
        }

        return this.setState(input, () => {
            if (data && listIds(conversations).includes(this.state.id)) {
                updateData(this.currentData)
            }
            if (callback) {
                callback()
            }
        })
    }

    changeValue(propery: keyof Conversation, newValue: string | number | boolean) {
        const modification: Partial<State> = {}
        switch (propery) {
            case 'id':
                if (typeof newValue === 'string') {
                    modification[propery] = newValue.toUpperCase()
                }
                break;
            case 'currentBranch':
            case 'defaultBranch':
                if (typeof newValue === 'string') {
                    modification[propery] = newValue
                }
                break;
        }
        if (propery === 'id') {
            return this.setState(modification)
        }
        this.setStateWithAutosave(modification)
    }
    handleLoadButton = async () => {
        const { data, error } = await uploadJsonData(ConversationSchema)
        if (data) {
            this.setState(data)
        } else {
            console.warn("NOT ACTOR DATA", error)
        }
    }
    handleResetButton() {
        const { props } = this
        const initialState = props.data ? cloneData(props.data) : makeBlankConversation()
        this.setState(initialState)
    }
    handleUpdateButton() {
        if (this.props.updateData) {
            this.props.updateData(this.currentData)
        }
    }

    updateChoiceListItem(
        property: 'enablesChoices' | 'disablesChoices',
        indexOfSet: number,
        newRefSet: ChoiceRefSet,
    ) {
        this.setStateWithAutosave(state => {
            const { branches } = state
            const { choice } = this.getBranchAndChoice(state)
            if (!choice) { return {} }
            if (!choice[property]) { choice[property] = [] }
            choice[property]?.splice(indexOfSet, 1, newRefSet)
            return { branches }
        })
    }

    addChoiceListItem(
        property: 'enablesChoices' | 'disablesChoices'
    ) {
        this.setStateWithAutosave(state => {
            const { branches } = state
            const { choice } = this.getBranchAndChoice(state)
            if (!choice) { return {} }
            if (!choice[property]) { choice[property] = [] }
            choice[property]?.push({})
            return { branches }
        })
    }

    removeChoiceListItem(
        property: 'enablesChoices' | 'disablesChoices',
        index: number
    ) {
        this.setStateWithAutosave(state => {
            const { branches } = state
            const { choice } = this.getBranchAndChoice(state)
            if (!choice || !choice[property]) { return {} }
            choice[property]?.splice(index, 1)
            return { branches }
        })
    }

    handleChoiceChange(value: FieldValue, field: FieldDef) {

        this.setStateWithAutosave(state => {
            const { branches, openBranchId, activeChoiceIndex } = state
            if (!openBranchId || typeof activeChoiceIndex !== 'number') { return {} }
            const choices = branches[openBranchId]?.choices
            if (!choices) { return {} }
            const choice = choices[activeChoiceIndex]
            if (!choice) { return {} }

            Object.assign(choice, getModification(value, field))
            return { branches }
        })
    }

    changeBranch(branchName: string, branch: ConversationBranch | undefined) {
        this.setStateWithAutosave(state => {
            const { branches = {} } = state
            if (branch) {
                branches[branchName] = branch
            } else {
                delete branches[branchName]
            }
            return { branches }
        })
    }

    addNewBranch(branchName: string) {
        if (!branchName || this.state.branches[branchName]) {
            return
        }
        this.setStateWithAutosave(state => {
            const { branches = {} } = state
            const numberOfBranches = Object.keys(branches).length
            const branchKey = branchName || `BRANCH_${numberOfBranches + 1}`
            branches[branchKey] = {
                choices: [
                    makeBlankConversationChoice()
                ]
            }
            return { branches, openBranchId: branchKey, activeChoiceIndex: 0 }
        })
    }

    mutateChoiceList(branchKey: string, newList: ConversationChoice[]) {
        this.setStateWithAutosave(state => {
            const { branches = {} } = state
            const branch = branches[branchKey];
            if (branch) { branch.choices = newList }
            return { branches }
        })
    }

    addNewChoice(folderId: string): void {
        this.setStateWithAutosave(state => {
            const { branches = {} } = state
            const branch = branches[folderId]
            if (!branch) { return {} }
            branch.choices.push(makeBlankConversationChoice())
            return { branches }
        })
    }

    addSequence(sequence: Sequence) {
        this.setStateWithAutosave(state => {
            const { choice } = this.getBranchAndChoice(state)
            if (choice) {
                choice.sequence = sequence.id
            }
            return state
        }, () => {
            this.props.updateSequenceData(sequence)
        })
    }

    getBranchAndChoice(state: State): { branch?: ConversationBranch; choice?: ConversationChoice } {
        const { activeChoiceIndex, openBranchId, branches } = state
        const result: { branch?: ConversationBranch; choice?: ConversationChoice } = {}
        if (openBranchId) {
            result.branch = branches[openBranchId]
            if (result.branch && typeof activeChoiceIndex === 'number') {
                result.choice = result.branch.choices[activeChoiceIndex]
            }
        }
        return result
    }

    render() {
        const { state, handleChoiceChange, addChoiceListItem, removeChoiceListItem, updateChoiceListItem, addSequence } = this
        const { branches, defaultBranch, currentBranch, openBranchId, id, activeChoiceIndex, editOrderDialogBranchId } = this.state
        const { conversations, deleteData, options, gameDesign, updateSequenceData } = this.props
        const { choice } = this.getBranchAndChoice(state)

        const branchInOrderDialog = editOrderDialogBranchId ? branches[editOrderDialogBranchId] : undefined

        return (
            <Stack component={'article'} spacing={2}>
                <EditorHeading heading={`Conversation Editor`} itemId={id} />
                <Stack spacing={2} direction={'row'}>
                    <EditorBox title={'Conversation'}>
                        <Stack spacing={2} minWidth={'md'}>
                            <StringInput
                                label="id"
                                value={state.id || ''}
                                inputHandler={value => { this.changeValue('id', value) }} />
                            <SelectInput
                                label="defaultBranch"
                                value={defaultBranch}
                                options={Object.keys(branches)}
                                inputHandler={(item) => { if (item) { this.changeValue('defaultBranch', item) } }} />
                            <SelectInput
                                label="currentBranch" value={currentBranch || ''} options={Object.keys(branches)}
                                optional
                                inputHandler={(item) => { if (item) { this.changeValue('defaultBranch', item) } }} />
                        </Stack>
                    </EditorBox>

                    <StorageMenu
                        type="conversation"
                        data={this.currentData}
                        originalId={this.props.data?.id}
                        existingIds={listIds(conversations)}
                        reset={this.handleResetButton}
                        update={this.handleUpdateButton}
                        deleteItem={deleteData}
                        saveButton={true}
                        load={this.handleLoadButton}
                        options={options}
                    />
                </Stack>

                <ConversationFlow conversation={this.currentData} key={JSON.stringify(this.currentData)}
                    openEditor={(branchKey, choiceIndex) => {
                        this.setState(
                            { openBranchId: branchKey, activeChoiceIndex: choiceIndex }
                        )
                    }}
                    openOrderDialog={(branchKey) => {
                        this.setState(
                            { editOrderDialogBranchId: branchKey }
                        )
                    }}
                    addNewChoice={this.addNewChoice}
                    deleteBranch={branchKey => {
                        this.setStateWithAutosave(
                            {
                                branches: {
                                    ...this.currentData.branches,
                                    [branchKey]: undefined
                                }
                            }
                        )
                    }}
                    addNewBranch={this.addNewBranch}
                />

                <Dialog open={!!this.state.editOrderDialogBranchId}
                    onClose={() => { this.setState({ editOrderDialogBranchId: undefined }) }}
                >
                    <DialogTitle>Edit Order: {editOrderDialogBranchId}</DialogTitle>

                    <DialogContent>
                        {(branchInOrderDialog && editOrderDialogBranchId) &&
                            <ListEditor tight
                                list={branchInOrderDialog.choices}
                                describeItem={(choice) => {
                                    return (
                                        <ChoiceDescription choice={choice} />
                                    )
                                }}
                                mutateList={newList => {
                                    this.mutateChoiceList(editOrderDialogBranchId, newList)
                                }}
                            />
                        }
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={!!choice}
                    maxWidth={'xl'}
                    onClose={() => { this.setState({ activeChoiceIndex: undefined }) }}
                >
                    <DialogTitle>
                        Branch {'"'}{openBranchId}{'"'} : choice #{activeChoiceIndex}
                    </DialogTitle>
                    <DialogContent>
                        {choice && (<>
                            <ChoiceEditor
                                key={`choice-editor-${openBranchId}-${activeChoiceIndex}`}
                                choice={choice}
                                conversation={this.state}
                                openBranchId={openBranchId ?? ''}
                                activeChoiceIndex={activeChoiceIndex ?? -1}
                                {...{
                                    handleChoiceChange, addChoiceListItem, removeChoiceListItem, updateChoiceListItem, addSequence
                                }}
                            />
                        </>)}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="outlined"
                            disabled={!choice?.sequence}
                            onClick={() => { this.setState({ sequenceDialogOpen: true }) }}>edit sequence</Button>
                        <Button
                            variant="contained"
                            onClick={() => { this.setState({ activeChoiceIndex: undefined }) }}>close</Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={!!this.state.sequenceDialogOpen}
                    onClose={() => { this.setState({ sequenceDialogOpen: false }) }}
                    maxWidth={'xl'}
                >

                    {choice && choice.sequence && (
                        <DialogContent>
                            <SequenceEditor key={choice.sequence} isSubSection
                                sequenceId={choice.sequence}
                                data={findById(choice.sequence, gameDesign.sequences)}
                                updateData={updateSequenceData}
                                deleteData={(index) => { console.log('delete squence', index) }}
                                gameDesign={gameDesign}
                                options={options}
                            />
                        </DialogContent>
                    )}
                    <DialogActions>
                        <Button
                            variant="contained"
                            onClick={() => { this.setState({ sequenceDialogOpen: false }) }}>close</Button>
                    </DialogActions>
                </Dialog>
            </Stack>
        )
    }
}