/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h, Fragment } from "preact";
import { GameDesign, Verb, Command, CommandTarget, ItemData } from "src";
import { cloneData } from "../../lib/clone";
import { makeBlankVerb } from "./defaults";
import { StorageMenu } from "./StorageMenu";
import { listIds } from "../../lib/util";
import { FieldDef, SchemaForm, FieldValue, getModification } from "./SchemaForm";
import { VerbSchema } from "../../definitions/Verb";
import { DataItemEditorProps } from "./dataEditors";
import { describeCommand, getDefaultResponseText, wildCard } from "../../lib/commandFunctions";


type Props = DataItemEditorProps<Verb> & {
    gameDesign: GameDesign;
}

type ExtraState = {

}
type State = Verb & ExtraState

const testTarget: CommandTarget = {
    type: 'hotspot',
    id: '(target)',
    name: '(target)',
    parallax: 0,
    status: '',
    circle: 0,
    x: 0, y: 0,
} as const;

const testItem: ItemData = {
    type: 'item',
    id: '(item)',
    name: '(item)',
}

export class VerbEditor extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = this.initialState
    }

    get initialState(): Verb {
        const { data } = this.props
        return data ? {
            ...cloneData(data)
        } : makeBlankVerb()
    }

    get currentData(): Verb {
        const Verb = cloneData(this.state) as State;
        return Verb
    }

    handleUpdate(value: FieldValue, field: FieldDef): void {
        return this.setState(getModification(value, field))
    }

    get testCommand(): Command {
        return {
            verb: this.state,
            target: testTarget,
        }
    }

    get testCommandWithItem(): Command {
        return {
            verb: this.state,
            target: testTarget,
            item: testItem,
        }
    }

    render() {
        const { gameDesign, updateData } = this.props

        return (
            <article>
                <h2>Verb Editor</h2>

                <StorageMenu
                    type="Verb"
                    update={() => updateData(this.currentData)}
                    deleteItem={this.props.deleteData}
                    existingIds={listIds(gameDesign.verbs)}
                    data={this.currentData}
                    originalId={this.props.data?.id}
                    reset={() => this.setState(this.initialState)}
                />

                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <fieldset style={{ maxWidth: '25rem' }}>
                        <SchemaForm
                            data={this.currentData}
                            schema={VerbSchema}
                            changeValue={(value, field) => { this.handleUpdate(value, field) }}
                        />
                    </fieldset>
                    <fieldset>
                        <table>
                            <caption>wildcards</caption>
                            <tbody>
                                {Object.entries(wildCard).map(([key, value]) => (
                                    <tr key={key}>
                                        <th>{key}</th>
                                        <td>{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </fieldset>
                </div>

                <fieldset style={{ position: 'relative', maxWidth: '100%' }}>
                    <legend>Preview</legend>
                    <p>COMMAND: <b>{describeCommand(this.testCommand, true)}</b></p>
                    <p>{getDefaultResponseText(this.testCommand, false)}</p>
                    <p>{getDefaultResponseText(this.testCommand, true)}</p>

                    {!!this.state.preposition && <>
                        <p>COMMAND: <b>{describeCommand(this.testCommandWithItem, true)}</b></p>
                        <p>{getDefaultResponseText(this.testCommandWithItem, false)}</p>
                    </>}
                </fieldset>
            </article>
        )
    }
}
