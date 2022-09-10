/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import { GameDesign, Verb } from "src";
import { cloneData } from "../../lib/clone";
import { makeBlankVerb } from "./defaults";
import { StorageMenu } from "./StorageMenu";
import { listIds } from "../../lib/util";
import { FieldDef, SchemaForm, FieldValue, getModification } from "./SchemaForm";
import { VerbSchema } from "../../definitions/Verb";
import { DataItemEditorProps } from "./dataEditors";


type Props = DataItemEditorProps<Verb> & {
    gameDesign: GameDesign;
}

type ExtraState = {

}
type State = Verb & ExtraState



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
        return this.setState(getModification(value,field))
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

                <fieldset style={{ maxWidth: '25rem' }}>
                    <SchemaForm
                        data={this.currentData}
                        schema={VerbSchema}
                        changeValue={(value, field) => { this.handleUpdate(value, field) }}
                    />
                </fieldset>

                <fieldset style={{ position: 'relative', maxWidth: '100%' }}>
                    <legend>Preview</legend>
                    <p>{this.state.label}</p>
                </fieldset>
            </article>
        )
    }
}
