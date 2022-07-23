/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import { eventToString } from "../../../lib/util";
import { SelectInput, TextInput } from "../formControls";


import { cloneData } from "../../../lib/clone";
import { uploadJsonData } from "../../../lib/files";
import { StorageMenu } from "../StorageMenu";
import { Conversation, ConversationSchema } from "../../../definitions/Conversation";


type ExtraState = {

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
        start: { choices: [] }
    }
})

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
    }

    get currentData(): Conversation {
        const conversation = cloneData(this.state) as State;
        return conversation
    }

    changeValue(propery: keyof Conversation, newValue: string | number | boolean) {
        const modification: Partial<State> = {}
        switch (propery) {
            case 'id':
            case 'currentBranch':
            case 'defaultBranch':
                if (typeof newValue === 'string') {
                    modification[propery] = newValue.toUpperCase()
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


    render() {
        const { state } = this
        const { branches, defaultBranch, currentBranch } = this.state
        const { conversationIds: characterIds } = this.props

        return (
            <article>
                <h2>Conversation Editor</h2>

                <fieldset>
                    <legend>Id</legend>
                    <div>
                        <TextInput label="id" value={state.id || ''} onInput={event => { this.changeValue('id', eventToString(event)) }} />
                    </div>

                    <div>
                        <SelectInput label="defaultBranch" value={defaultBranch} items={Object.keys(branches)}
                            onSelect={(item: string) => { this.changeValue('defaultBranch', item) }} />
                    </div>

                    <div>
                        <SelectInput label="currentBranch" value={currentBranch || ''} items={Object.keys(branches)}
                            haveEmptyOption={true} emptyOptionLabel="(choose branch)"
                            onSelect={(item: string) => { this.changeValue('currentBranch', item) }} />
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Branches</legend>
                    <ul>
                        {Object.entries(state.branches).map(([id, branch]) => (
                            <li key={id}>{id}</li>
                        ))}
                    </ul>
                </fieldset>

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


            </article>
        )
    }
}