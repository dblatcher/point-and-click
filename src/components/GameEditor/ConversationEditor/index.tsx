/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import { eventToString, findById } from "../../../lib/util";
import { SelectInput, TextInput } from "../formControls";

import { cloneData } from "../../../lib/clone";
import { uploadJsonData } from "../../../lib/files";
import { StorageMenu } from "../StorageMenu";
import { Conversation, ConversationBranch, ConversationChoice, ConversationSchema, ConversationBranchSchema, ConversationChoiceSchema } from "../../../definitions/Conversation";
import { Folder, TreeMenu } from "../TreeMenu";
import styles from "../editorStyles.module.css"
import { SchemaForm, type FieldDef, type FieldValue } from "../SchemaForm";

type ExtraState = {
    openBranchId?: string;
    activeChoiceIndex?: number;
}

type State = Conversation & ExtraState;

type Props = {
    data?: Conversation;
    updateData?: { (data: Conversation): void };
    conversationIds: string[];
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
    handleChoiceChange(value: FieldValue, field: FieldDef) {
        const { openBranchId, activeChoiceIndex } = this.state
        console.log(value, field, 'index')
        console.log(`Change field ${field.key}(${field.type}) to "${value?.toString()}" in ${openBranchId}[${activeChoiceIndex}]`)

        this.setState(state => {
            const { branches, openBranchId, activeChoiceIndex } = state
            if (!openBranchId || typeof activeChoiceIndex !== 'number') { return {} }
            const choices = branches[openBranchId]?.choices
            if (!choices) {return {}}
            const choice = choices[activeChoiceIndex]
            if (!choice) {return {}}

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

            return {branches}
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

    get branchAndChoice(): { branch?: ConversationBranch; choice?: ConversationChoice } {
        const { activeChoiceIndex, openBranchId, branches } = this.state
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
        const { branches, defaultBranch, currentBranch, openBranchId } = this.state
        const { conversationIds: characterIds } = this.props

        const { branch, choice } = this.branchAndChoice

        return (
            <article>
                <h2>Conversation Editor</h2>
                <StorageMenu
                    type="conversation"
                    data={this.currentData}
                    originalId={this.props.data?.id}
                    existingIds={characterIds}
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

                    <div>
                        {branch && (
                            <div>
                                <p>{openBranchId}</p>
                                <hr />
                            </div>
                        )}
                        {choice && (
                            <div>
                                <SchemaForm
                                    schema={ConversationChoiceSchema}
                                    data={choice}
                                    changeValue={this.handleChoiceChange}
                                />
                            </div>
                        )}
                    </div>

                </fieldset>
            </article>
        )
    }
}