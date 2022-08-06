/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import { GameDesign, Ending } from "src";
import { cloneData } from "../../../lib/clone";
import { makeBlankEnding } from "../defaults";
import { StorageMenu } from "../StorageMenu";
import { listIds } from "../../../lib/util";
import { FieldDef, SchemaForm, FieldValue, fieldValueIsRightType } from "../SchemaForm";
import { EndingSchema } from "../../../definitions/Ending";

interface Props {
    gameDesign: GameDesign;
    data?: Ending;
    updateData: { (data: Ending): void };
}

type ExtraState = {

}
type State = Ending & ExtraState



export class EndingEditor extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = this.initialState
    }

    get initialState(): Ending {
        const { data } = this.props
        return data ? {
            ...cloneData(data)
        } : makeBlankEnding()
    }

    get currentData(): Ending {
        const ending = cloneData(this.state) as State;
        return ending
    }

    handleUpdate(value: FieldValue, field: FieldDef): void {
        if (!fieldValueIsRightType(value, field)) {
            console.warn('MISMATCH FROM SCHEMA FORM', value, field)
            return
        }
        const property = field.key as keyof Ending;

        const mod: Partial<Ending> = {}
        switch (property) {
            case 'id':
            case 'message':
                mod[property] = value as string
                break;
            case 'imageId':
                mod[property] = value as string | undefined
                break;
        }
        return this.setState(mod)
    }


    render() {
        const { gameDesign, updateData } = this.props

        return (
            <article>
                <h2>Ending Editor</h2>

                <StorageMenu
                    type="ending"
                    update={() => updateData(this.currentData)}
                    existingIds={listIds(gameDesign.endings)}
                    data={this.currentData}
                    originalId={this.props.data?.id}
                    reset={() => this.setState(this.initialState)}
                />

                <fieldset style={{maxWidth:'25rem'}}>
                    <SchemaForm
                        data={this.currentData}
                        schema={EndingSchema}
                        changeValue={(value, field) => { this.handleUpdate(value, field) }}
                    />
                </fieldset>

            </article>
        )
    }
}