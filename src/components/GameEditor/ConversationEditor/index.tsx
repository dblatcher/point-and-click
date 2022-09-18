/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import { eventToString, listIds } from "../../../lib/util";
import { SelectInput, TextInput } from "../formControls";

import { cloneData } from "../../../lib/clone";
import { uploadJsonData } from "../../../lib/files";
import { StorageMenu } from "../StorageMenu";
import { Conversation, ConversationBranch, ConversationChoice, ConversationSchema, ConversationChoiceSchema, ChoiceRefSet } from "../../../definitions/Conversation";
import { Entry, Folder, TreeMenu } from "../TreeMenu";
import styles from "../editorStyles.module.css"
import { SchemaForm, type FieldDef, type FieldValue } from "../SchemaForm";
import { ChoiceListControl } from "./ChoiceListControl";
import { makeBlankConversation, makeBlankConversationChoice } from "../defaults";
import { DataItemEditorProps } from "../dataEditors"

type ExtraState = {
    openBranchId?: string;
    activeChoiceIndex?: number;
}

type State = Conversation & ExtraState;

type Props = DataItemEditorProps<Conversation> & {
    conversations: Conversation[];
    sequenceIds: string[];
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

    //TO DO - find the bug that results in the list being [string, null, null]!
    // {x:[1,undefined,1]} clones to {x:[1,null,1]}
    // either support null value at runtime of change the schema to avoid
    // undefined as array members
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
        const { openBranchId, activeChoiceIndex } = this.state
        console.log(value, field, 'index')
        console.log(`Change field ${field.key}(${field.type}) to "${value?.toString()}" in ${openBranchId}[${activeChoiceIndex}]`)

        this.setStateWithAutosave(state => {
            const { branches, openBranchId, activeChoiceIndex } = state
            if (!openBranchId || typeof activeChoiceIndex !== 'number') { return {} }
            const choices = branches[openBranchId]?.choices
            if (!choices) { return {} }
            const choice = choices[activeChoiceIndex]
            if (!choice) { return {} }

            const castKey = field.key as keyof ConversationChoice;
            switch (castKey) {
                case 'disabled':
                case 'end':
                case 'once':
                    if (typeof value === 'boolean') {
                        choice[castKey] = value as boolean;
                    }
                    if (typeof value === 'undefined' && field.optional) {
                        choice[castKey] = undefined
                    }
                    break;
                case 'nextBranch':
                case 'ref':
                case 'sequence':
                case 'text':
                    if (typeof value === 'string') {
                        choice[castKey] = value as string;
                    }
                    break;
                case 'disablesChoices':
                case 'enablesChoices':
                    console.warn('unsupported:')
            }

            return { branches }
        })
    }

    addNewBranch() {
        this.setStateWithAutosave(state => {
            const { branches = {} } = state
            const numberOfBranches = Object.keys(branches).length
            const branchKey = `BRANCH_${numberOfBranches + 1}`
            branches[branchKey] = {
                choices: [
                    makeBlankConversationChoice()
                ]
            }
            return { branches, openBranchId: branchKey }
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

    get conversationTree(): Folder[] {
        const { branches, openBranchId, activeChoiceIndex } = this.state
        const branchFolders = Object.entries(branches).map(([id, branch]) => {

            const entries: Entry[] = branch?.choices.map((choice, index) => ({
                label: choice.text ? truncateLine(choice.text, 25) : "[no text]",
                active: openBranchId === id && activeChoiceIndex === index,
                data: {
                    id: index.toString(),
                }
            })) || []

            entries?.push({
                label: "+ [new choice]",
                active: false,
                isForNew: true,
                data: {
                    id: '',
                }
            })

            return {
                id,
                open: openBranchId === id,
                entries,
            }
        })

        const newBranchFolder: Folder = {
            id: '',
            label: '+ [NEW BRANCH]',
            open: false,
        }

        return [...branchFolders, newBranchFolder]
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
        const { conversations, sequenceIds, deleteData, options } = this.props
        const { choice } = this.getBranchAndChoice(state)

        return (
            <article>
                <h2>Conversation Editor</h2>
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
                <fieldset>
                    <legend>Conversation</legend>
                    <div>
                        <TextInput label="id"
                            value={state.id || ''}
                            onInput={event => { this.changeValue('id', eventToString(event)) }} />
                    </div>

                    <div>
                        <SelectInput label="defaultBranch"
                            value={defaultBranch}
                            items={Object.keys(branches)}
                            onSelect={(item: string) => { this.changeValue('defaultBranch', item) }} />
                    </div>

                    <div>
                        <SelectInput label="currentBranch" value={currentBranch || ''} items={Object.keys(branches)}
                            haveEmptyOption={true} emptyOptionLabel="(choose branch)"
                            onSelect={(item: string) => { this.changeValue('currentBranch', item) }} />
                    </div>
                </fieldset>

                <fieldset className={styles.rowTopLeft}>

                    <TreeMenu
                        folders={this.conversationTree}
                        folderClick={(folderId) => {
                            if (!folderId) {
                                return this.addNewBranch()
                            }
                            this.setState({
                                openBranchId: folderId,
                                activeChoiceIndex: undefined,
                            })
                        }}
                        entryClick={(folderId, data, isForNew) => {
                            if (isForNew) {
                                return this.addNewChoice(folderId)
                            }
                            this.setState({
                                openBranchId: folderId,
                                activeChoiceIndex: Number(data.id),
                            })
                        }} />

                    {choice && (
                        <section style={{ paddingLeft: '1em' }}>
                            <SchemaForm key={`schema-${id}-${openBranchId}-${activeChoiceIndex}`}
                                schema={ConversationChoiceSchema}
                                data={choice}
                                changeValue={this.handleChoiceChange}
                                options={{
                                    sequence: sequenceIds,
                                    nextBranch: Object.keys(this.state.branches),
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
                        </section>
                    )}


                </fieldset>
            </article>
        )
    }
}