
import { getModification, type FieldDef, type FieldValue } from "@/components/SchemaForm";
import { GameDesign, Sequence } from "@/definitions";
import { ChoiceRefSet, Conversation, ConversationBranch, ConversationChoice, ConversationSchema } from "@/definitions/Conversation";
import { cloneData } from "@/lib/clone";
import { uploadJsonData } from "@/lib/files";
import { findById, listIds } from "@/lib/util";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import { Component } from "react";
import { ArrayControl } from "../ArrayControl";
import { EditorHeading } from "../EditorHeading";
import { SequenceEditor } from "../SequenceEditor";
import { StorageMenu } from "../StorageMenu";
import { DataItemEditorProps } from "../dataEditors";
import { makeBlankConversation, makeBlankConversationChoice } from "../defaults";
import { ChoiceDescription } from "./ChoiceDescription";
import { ChoiceEditor } from "./ChoiceEditor";
import { ConversationFlow } from "./ConversationFlow";


type State = {
    openBranchId?: string;
    activeChoiceIndex?: number;
    sequenceDialogOpen?: boolean;
    editOrderDialogBranchId?: string;
};

type Props = DataItemEditorProps<Conversation> & {
    data: Conversation,
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
        this.handleChoiceChange = this.handleChoiceChange.bind(this)
        this.updateChoiceListItem = this.updateChoiceListItem.bind(this)
        this.addChoiceListItem = this.addChoiceListItem.bind(this)
        this.removeChoiceListItem = this.removeChoiceListItem.bind(this)
        this.addSequence = this.addSequence.bind(this)
        this.addNewBranchAndOpenIt = this.addNewBranchAndOpenIt.bind(this)
        this.addNewChoice = this.addNewChoice.bind(this)
        this.changeBranch = this.changeBranch.bind(this)
        this.mutateChoiceList = this.mutateChoiceList.bind(this)

        this.updateFromPartial = this.updateFromPartial.bind(this)
    }

    get currentData(): Conversation {
        const conversation = cloneData(this.props.data);
        return conversation
    }



    updateFromPartial(input: Partial<Conversation>) {
        const { data, updateData, conversations } = this.props
        const revisedData = {
            ...this.currentData,
            ...input,
        }
        if (data && listIds(conversations).includes(data.id)) {
            updateData(revisedData)
        }
    }

    changeValue(propery: keyof Conversation, newValue: string | number | boolean) {
        const modification: Partial<Conversation> = {}
        switch (propery) {
            case 'id':
                console.warn("id change passed to ConversationEditor.changeValue", { newValue })
                return;
            case 'currentBranch':
            case 'defaultBranch':
                if (typeof newValue === 'string') {
                    modification[propery] = newValue
                }
                break;
        }
        this.updateFromPartial(modification)
    }
    handleLoadButton = async () => {
        const { data, error } = await uploadJsonData(ConversationSchema)
        if (data) {
            // this.setState(data)
            console.log("TO DO - fix loading from JSON")
        } else {
            console.warn("NOT ACTOR DATA", error)
        }
    }

    updateChoiceListItem(
        property: 'enablesChoices' | 'disablesChoices',
        indexOfSet: number,
        newRefSet: ChoiceRefSet,
    ) {

        const getModifiedBranches = () => {
            const { choice, branches } = this.getBranchAndChoice()
            if (!choice) { return {} }
            if (!choice[property]) { choice[property] = [] }
            choice[property]?.splice(indexOfSet, 1, newRefSet)
            return { branches }
        }

        this.updateFromPartial(getModifiedBranches())
    }

    addChoiceListItem(
        property: 'enablesChoices' | 'disablesChoices'
    ) {
        const getModifiedBranches = () => {
            const { choice, branches } = this.getBranchAndChoice()
            if (!choice) { return {} }
            if (!choice[property]) { choice[property] = [] }
            choice[property]?.push({})
            return { branches }
        }
        this.updateFromPartial(getModifiedBranches())
    }

    removeChoiceListItem(
        property: 'enablesChoices' | 'disablesChoices',
        index: number
    ) {
        const getModifiedBranches = () => {
            const { choice, branches } = this.getBranchAndChoice()
            if (!choice || !choice[property]) { return {} }
            choice[property]?.splice(index, 1)
            return { branches }
        }
        this.updateFromPartial(getModifiedBranches())
    }

    handleChoiceChange(value: FieldValue, field: FieldDef) {
        const getModifiedBranches = () => {
            const { choice, branches } = this.getBranchAndChoice()
            if (!choice) { return {} }
            Object.assign(choice, getModification(value, field))
            return { branches }
        }
        this.updateFromPartial(getModifiedBranches())
    }

    changeBranch(branchName: string, changedBranch: ConversationBranch | undefined) {
        const getModifiedBranches = () => {
            const { branches } = this.getBranchAndChoice()
            if (changedBranch) {
                branches[branchName] = changedBranch
            } else {
                delete branches[branchName]
            }
            return { branches }
        }
        this.updateFromPartial(getModifiedBranches())
    }

    addNewBranchAndOpenIt(branchName: string) {
        if (!branchName || this.props.data.branches[branchName]) {
            return
        }
        const getModifiedBranches = () => {
            const { branches } = this.getBranchAndChoice()
            branches[branchName] = {
                choices: [
                    makeBlankConversationChoice()
                ]
            }
            return { branches }
        }
        this.updateFromPartial(getModifiedBranches())
        this.setState({
            openBranchId: branchName, activeChoiceIndex: 0
        })
    }

    mutateChoiceList(branchKey: string, newList: ConversationChoice[]) {
        const getModifiedBranches = () => {
            const { branches } = this.getBranchAndChoice()
            const branch = branches[branchKey];
            if (branch) { branch.choices = newList }
            return { branches }
        }
        this.updateFromPartial(getModifiedBranches())
    }

    addNewChoice(folderId: string): void {
        const getModifiedBranches = () => {
            const { branches } = this.getBranchAndChoice()
            const branch = branches[folderId]
            if (!branch) { return {} }
            branch.choices.push(makeBlankConversationChoice())
            return { branches }
        }
        this.updateFromPartial(getModifiedBranches())
    }

    addSequence(sequence: Sequence) {
        const getModifiedBranches = () => {
            const { choice, branches } = this.getBranchAndChoice()
            if (choice) {
                choice.sequence = sequence.id
            }
            return { branches }
        }
        this.updateFromPartial(getModifiedBranches())
        this.props.updateSequenceData(sequence)
    }

    getBranchAndChoice(): { branch?: ConversationBranch; choice?: ConversationChoice, branches: Conversation['branches'] } {
        const { branches } = this.currentData
        const { activeChoiceIndex, openBranchId } = this.state
        const result: { branch?: ConversationBranch; choice?: ConversationChoice, branches: Conversation['branches'] } = { branches }
        if (openBranchId) {
            result.branch = branches[openBranchId]
            if (result.branch && typeof activeChoiceIndex === 'number') {
                result.choice = result.branch.choices[activeChoiceIndex]
            }
        }
        return result
    }

    render() {
        const { handleChoiceChange, addChoiceListItem, removeChoiceListItem, updateChoiceListItem, addSequence } = this
        const { openBranchId, activeChoiceIndex, editOrderDialogBranchId } = this.state
        const { conversations, deleteData, options, gameDesign, updateSequenceData, data: conversation } = this.props
        const { choice } = this.getBranchAndChoice()

        const branchInOrderDialog = editOrderDialogBranchId ? conversation.branches[editOrderDialogBranchId] : undefined

        return (
            <Stack component={'article'} spacing={2}>
                <EditorHeading heading={`Conversation Editor`} itemId={conversation.id} />
                <Stack spacing={2} direction={'row'}>
                    <StorageMenu
                        type="conversation"
                        data={this.currentData}
                        originalId={conversation.id}
                        existingIds={listIds(conversations)}
                        deleteItem={deleteData}
                        saveButton={true}
                        load={this.handleLoadButton}
                        options={options} reset={() => { }} update={() => { }} />
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
                        this.updateFromPartial(
                            {
                                branches: {
                                    ...this.currentData.branches,
                                    [branchKey]: undefined
                                }
                            }
                        )
                    }}
                    changeDefaultBranch={branchKey => {
                        if (branchKey) { this.changeValue('defaultBranch', branchKey) }
                    }}
                    addNewBranch={this.addNewBranchAndOpenIt}
                />

                <Dialog open={!!this.state.editOrderDialogBranchId}
                    onClose={() => { this.setState({ editOrderDialogBranchId: undefined }) }}
                >
                    <DialogTitle>{`Sort choices in branch "${editOrderDialogBranchId}"`}</DialogTitle>

                    <DialogContent>
                        {(branchInOrderDialog && editOrderDialogBranchId) &&
                            <ArrayControl horizontalMoveButtons
                                list={branchInOrderDialog.choices}
                                describeItem={(choice) => <ChoiceDescription choice={choice} />}
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
                                conversation={this.props.data}
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