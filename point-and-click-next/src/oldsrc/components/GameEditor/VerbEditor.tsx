/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component } from "react";
import { GameDesign, Verb, Command, CommandTarget, ItemData } from "src";
import { cloneData } from "../../../lib/clone";
import { makeBlankVerb } from "./defaults";
import { StorageMenu } from "./StorageMenu";
import { listIds } from "../../../lib/util";
import { FieldDef, SchemaForm, FieldValue, getModification } from "./SchemaForm";
import { VerbSchema } from "../../definitions/Verb";
import { DataItemEditorProps } from "./dataEditors";
import { describeCommand, getDefaultResponseText, wildCard } from "../../../lib/commandFunctions";
import { EditorHeading } from "./EditorHeading";


type Props = DataItemEditorProps<Verb> & {
    gameDesign: GameDesign;
}

type ExtraState = {

}
type State = Verb & ExtraState

const testTarget: CommandTarget = {
    type: 'hotspot',
    id: '(target)',
    name: '{{target}}',
    parallax: 0,
    status: '',
    circle: 0,
    x: 0, y: 0,
} as const;

const testItem: ItemData = {
    type: 'item',
    id: '(item)',
    name: '{{item}}',
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
        const { options, data, updateData, gameDesign } = this.props
        const property = field.key as keyof Verb;

        return this.setState(getModification(value, field), () => {
            if (options.autoSave && property !== 'id') {
                const isExistingId = listIds(gameDesign.verbs).includes(this.state.id)
                if (data && isExistingId) {
                    updateData(this.currentData)
                }
            }
        })
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
        const { gameDesign, updateData, options } = this.props

        return (
            <article>
                <EditorHeading heading="Verb Editor" />
                <StorageMenu
                    type="Verb"
                    update={() => updateData(this.currentData)}
                    deleteItem={this.props.deleteData}
                    existingIds={listIds(gameDesign.verbs)}
                    data={this.currentData}
                    originalId={this.props.data?.id}
                    reset={() => this.setState(this.initialState)}
                    options={options}
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
                    <legend>Samples</legend>
                    <div>COMMAND: <b>{describeCommand(this.testCommand, true)}</b></div>
                    <ul>
                        <li>DEFAULT(reachable): {getDefaultResponseText(this.testCommand, false)}</li>
                        <li>DEFAULT(unreachable):{getDefaultResponseText(this.testCommand, true)}</li>
                    </ul>

                    {!!this.state.preposition && <>
                        <div>COMMAND: <b>{describeCommand(this.testCommandWithItem, true)}</b></div>
                        <ul>
                            <li>DEFAULT(reachable): {getDefaultResponseText(this.testCommandWithItem, false)}</li>
                            <li>DEFAULT(unreachable): {getDefaultResponseText(this.testCommandWithItem, true)}</li>
                        </ul>
                    </>}
                </fieldset>
            </article>
        )
    }
}
