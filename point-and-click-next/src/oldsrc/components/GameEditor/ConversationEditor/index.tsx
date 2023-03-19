/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component } from "react";
import { GameDesign, Sequence } from "src";
import { cloneData } from "../../../lib/clone";
import { uploadJsonData } from "../../../lib/files";
import { listIds, findById } from "../../../lib/util";
import { Conversation, ConversationBranch, ConversationChoice, ConversationSchema, ConversationChoiceSchema, ChoiceRefSet } from "../../../definitions/Conversation";
import { getModification, SchemaForm, type FieldDef, type FieldValue } from "../SchemaForm";
import { makeBlankConversation, makeBlankConversationChoice } from "../defaults";
import { DataItemEditorProps, icons } from "../dataEditors"
import { ChoiceListControl } from "./ChoiceListControl";
import { RecordEditor } from "../RecordEditor";
import { StorageMenu } from "../StorageMenu";
import { ListEditor } from "../ListEditor";
import { SelectInput, StringInput } from "../formControls";
import { SequenceEditor } from "../SequenceEditor";
import editorStyles from "../editorStyles.module.css"
import { NewSequenceForm } from "./NewSequenceForm";
import { EditorHeading } from "../EditorHeading";

type ExtraState = {
    openBranchId?: string;
    activeChoiceIndex?: number;
}

type State = Conversation & ExtraState;

type Props = DataItemEditorProps<Conversation> & {
    conversations: Conversation[];
    sequenceIds: string[];
    gameDesign: GameDesign;
    updateSequenceData: { (data: Sequence): void };
}


function truncateLine(text: string, length: number) {
    if (text.length <= length) {
        return text
    }
    return `${text.substring(0, length - 3)}...`;
}

export class ConversationEditor extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        const initialState = props.data ? cloneData(props.data) : makeBlankConversation()
        this.state = {
            ...initialState,
            openBranchId: initialState.defaultBranch,
            activeChoiceIndex: 0,
        }

        this.handleLoadButton = this.handleLoadButton.bind(this)
        this.handleResetButton = this.handleResetButton.bind(this)
        this.handleUpdateButton = this.handleUpdateButton.bind(this)
        this.handleChoiceChange = this.handleChoiceChange.bind(this)
        this.updateChoiceListItem = this.updateChoiceListItem.bind(this)
        this.addChoiceListItem = this.addChoiceListItem.bind(this)
        this.removeChoiceListItem = this.removeChoiceListItem.bind(this)
        this.addNewBranch = this.addNewBranch.bind(this)
        this.addNewChoice = this.addNewChoice.bind(this)
        this.changeBranch = this.changeBranch.bind(this)
        this.mutateChoiceList = this.mutateChoiceList.bind(this)

        this.setStateWithAutosave = this.setStateWithAutosave.bind(this)
    }

    get currentData(): Conversation {
        const conversation = cloneData(this.state) as State;
        delete conversation.openBranchId
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
        const { state } = this
        const { branches, defaultBranch, currentBranch, openBranchId, id, activeChoiceIndex } = this.state
        const { conversations, sequenceIds, deleteData, options, gameDesign, updateSequenceData } = this.props
        const { choice } = this.getBranchAndChoice(state)

        return (
            <article>
                <EditorHeading heading="Conversation Editor" />
                <section className={editorStyles.row}>
                    <fieldset>
                        <legend>Conversation</legend>
                        <StringInput block
                            label="id"
                            value={state.id || ''}
                            inputHandler={value => { this.changeValue('id', value) }} />
                        <SelectInput block
                            label="defaultBranch"
                            value={defaultBranch}
                            items={Object.keys(branches)}
                            onSelect={(item: string) => { this.changeValue('defaultBranch', item) }} />
                        <SelectInput block
                            label="currentBranch" value={currentBranch || ''} items={Object.keys(branches)}
                            haveEmptyOption={true} emptyOptionLabel="(choose branch)"
                            onSelect={(item: string) => { this.changeValue('currentBranch', item) }} />
                    </fieldset>
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
                </section>

                <section className={editorStyles.rowTopLeft}>

                    <fieldset>
                        <RecordEditor
                            record={branches}
                            addEntryLabel={'new branch'}
                            describeValue={(branchKey, branch) => {
                                return (
                                    <div key={branchKey}>
                                        <span>Branch: <strong>{branchKey}</strong></span>
                                        <ListEditor
                                            list={branch.choices}
                                            describeItem={(choice, choiceIndex) => {
                                                return (
                                                    <div key={choiceIndex}>
                                                        <button
                                                            onClick={() => {
                                                                this.setState({
                                                                    openBranchId: branchKey,
                                                                    activeChoiceIndex: choiceIndex,
                                                                })
                                                            }
                                                            }
                                                            style={{
                                                                textAlign: 'left',
                                                                minWidth: '12em',
                                                                padding: 2,
                                                                fontWeight: choiceIndex === activeChoiceIndex && branchKey === openBranchId ? 700 : 400,
                                                            }}>
                                                            {choice.text ? truncateLine(choice.text, 25) : "[no text]"}
                                                        </button>
                                                    </div>
                                                )
                                            }}
                                            mutateList={newList => {
                                                this.mutateChoiceList(branchKey, newList)
                                            }}
                                        />
                                        <button
                                            className={[editorStyles.button, editorStyles.plusButton].join(" ")}
                                            style={{ width: '100%' }}
                                            onClick={() => { this.addNewChoice(branchKey) }}>
                                            add choice{icons.INSERT}
                                        </button>
                                    </div>
                                )
                            }}
                            setEntry={this.changeBranch}
                            addEntry={(key) => {
                                this.addNewBranch(key)
                            }}
                        />
                    </fieldset>

                    {choice && (
                        <fieldset>
                            <SchemaForm key={`schema-${id}-${openBranchId}-${activeChoiceIndex}`}
                                schema={ConversationChoiceSchema}
                                data={choice}
                                changeValue={this.handleChoiceChange}
                                options={{
                                    sequence: sequenceIds,
                                    nextBranch: Object.keys(this.state.branches),
                                }}
                            />

                            <hr />
                            <NewSequenceForm
                                suggestedIds={[
                                    `${id}-${openBranchId}-${activeChoiceIndex}`,
                                ]}
                                existingIds={listIds(gameDesign.sequences)}
                                addSequence={(sequence) => {
                                    this.setStateWithAutosave(state => {
                                        const { choice } = this.getBranchAndChoice(state)
                                        if (choice) {
                                            choice.sequence = sequence.id
                                        }
                                        return state
                                    }, () => {
                                        updateSequenceData(sequence)
                                    })
                                }}
                            />

                            <ChoiceListControl key={`disablesChoices-${id}-${openBranchId}-${activeChoiceIndex}`}
                                choices={choice.disablesChoices || []}
                                property="disablesChoices"
                                conversations={conversations}
                                currentConversationId={id}
                                openBranchId={openBranchId || ''}
                                add={this.addChoiceListItem}
                                change={this.updateChoiceListItem}
                                remove={this.removeChoiceListItem}
                            />
                            <ChoiceListControl key={`enablesChoice-s${id}-${openBranchId}-${activeChoiceIndex}`}
                                choices={choice.enablesChoices || []}
                                property="enablesChoices"
                                conversations={conversations}
                                currentConversationId={id}
                                openBranchId={openBranchId || ''}
                                add={this.addChoiceListItem}
                                change={this.updateChoiceListItem}
                                remove={this.removeChoiceListItem}
                            />



                        </fieldset>
                    )}
                </section>

                <section style={{ marginTop: '1em' }}>
                    {choice && choice.sequence && (
                        <fieldset>
                            <SequenceEditor key={choice.sequence} isSubSection
                                sequenceId={choice.sequence}
                                data={findById(choice.sequence, gameDesign.sequences)}
                                updateData={updateSequenceData}
                                deleteData={(index) => { console.log('delete squence', index) }}
                                gameDesign={gameDesign}
                                options={options}
                            />
                        </fieldset>
                    )}
                </section>
            </article>
        )
    }
}