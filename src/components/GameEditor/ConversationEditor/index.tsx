/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import { eventToString, listIds } from "../../../lib/util";
import { SelectInput, TextInput } from "../formControls";

import { cloneData } from "../../../lib/clone";
import { uploadJsonData } from "../../../lib/files";
import { StorageMenu } from "../StorageMenu";
import { Conversation, ConversationBranch, ConversationChoice, ConversationSchema, ConversationChoiceSchema } from "../../../definitions/Conversation";
import { Folder, TreeMenu } from "../TreeMenu";
import styles from "../editorStyles.module.css"
import { SchemaForm, type FieldDef, type FieldValue } from "../SchemaForm";
import { ChoiceListControl } from "./ChoiceListControl";

type ExtraState = {
    openBranchId?: string;
    activeChoiceIndex?: number;
}

type State = Conversation & ExtraState;

type Props = {
    data?: Conversation;
    updateData?: { (data: Conversation): void };
    conversations: Conversation[];
    sequenceIds: string[];
}

const makeBlankConversation = (): Conversation => ({
    id: 'NEW_CONVERSATION',
    defaultBranch: 'start',
    branches: {
        start: {
            choices: [
                {
                    text: "ENTER CHOICE TEXT",
                    sequence: '',
                }
            ]
        }
    }
})

function truncateLine(text: string, length: number) {
    if (text.length <= length) {
        return text
    }
    return `${text.substring(0, length - 3)}...`;
}

export class ConversationEditor extends Component<Props, State> {

    constructor(props: Props) {
        super(props)

        const initialState = props.data ? {
            ...props.data
        } : makeBlankConversation()

        this.state = {
            ...initialState
        }

        this.handleLoadButton = this.handleLoadButton.bind(this)
        this.handleResetButton = this.handleResetButton.bind(this)
        this.handleUpdateButton = this.handleUpdateButton.bind(this)
        this.handleChoiceChange = this.handleChoiceChange.bind(this)
        this.updateChoiceListItem = this.updateChoiceListItem.bind(this)
        this.addChoiceListItem = this.addChoiceListItem.bind(this)
        this.removeChoiceListItem = this.removeChoiceListItem.bind(this)
    }

    get currentData(): Conversation {
        const conversation = cloneData(this.state) as State;
        delete conversation.openBranchId
        return conversation
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
        this.setState(modification)
    }
    handleLoadButton = async () => {
        const { data, error } = await uploadJsonData(ConversationSchema)
        if (data) {
            this.setState(data)
        } else {
            console.warn("NOT CHARACTER DATA", error)
        }
    }
    handleResetButton() {
        const { props } = this
        const initialState = props.data ? cloneData(props.data) : makeBlankConversation()
        this.setState({
            ...initialState
        })
    }
    handleUpdateButton() {
        if (this.props.updateData) {
            this.props.updateData(this.currentData)
        }
    }

    updateChoiceListItem(
        property: 'enablesChoices' | 'disablesChoices',
        indexOfSet: number,
        newRefSet: (string | undefined)[],
    ) {
        this.setState(state => {
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
        this.setState(state => {
            const { branches } = state
            const { choice } = this.getBranchAndChoice(state)
            if (!choice) { return {} }
            if (!choice[property]) { choice[property] = [] }
            choice[property]?.push([undefined, undefined, undefined])
            return { branches }
        })
    }

    removeChoiceListItem(
        property: 'enablesChoices' | 'disablesChoices',
        index: number
    ) {
        this.setState(state => {
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

        this.setState(state => {
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

    get conversationTree(): Folder[] {
        const { branches, openBranchId, activeChoiceIndex } = this.state
        return Object.entries(branches).map(([id, branch]) => {
            return {
                id,
                open: openBranchId === id,
                entries: branch?.choices.map((choice, index) => ({
                    label: choice.text ? truncateLine(choice.text, 25) : "[no text]",
                    active: openBranchId === id && activeChoiceIndex === index,
                    data: {
                        id: index.toString(),
                    }
                }))
            }
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
        const { branches, defaultBranch, currentBranch, openBranchId, id } = this.state
        const { conversations, sequenceIds } = this.props
        const { branch, choice } = this.getBranchAndChoice(state)

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
                    saveButton={true}
                    load={this.handleLoadButton}
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
                            this.setState({
                                openBranchId: folderId,
                                activeChoiceIndex: undefined,
                            })
                        }}
                        entryClick={(folderId, data) => {
                            this.setState({
                                openBranchId: folderId,
                                activeChoiceIndex: Number(data.id),
                            })
                        }} />

                        {choice && (
                            <section style={{paddingLeft:'1em'}}>
                                <SchemaForm
                                    schema={ConversationChoiceSchema}
                                    data={choice}
                                    changeValue={this.handleChoiceChange}
                                    options={{
                                        sequence: sequenceIds,
                                        nextBranch: Object.keys(this.state.branches),
                                    }}
                                />

                                <ChoiceListControl
                                    choices={choice.disablesChoices || []}
                                    property="disablesChoices"
                                    conversations={conversations}
                                    currentConversationId={id}
                                    openBranchId={openBranchId || ''}
                                    add={this.addChoiceListItem}
                                    change={this.updateChoiceListItem}
                                    remove={this.removeChoiceListItem}
                                />
                                <ChoiceListControl
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