import { Component } from "react";
import { GameDesign, Ending } from "@/definitions";
import { cloneData } from "@/lib/clone";
import { makeBlankEnding } from "../defaults";
import { StorageMenu } from "../StorageMenu";
import { listIds } from "@/lib/util";
import { FieldDef, SchemaForm, FieldValue, getModification } from "@/components/SchemaForm";
import { EndingSchema } from "@/definitions/Ending";
import imageService from "@/services/imageService";
import { EndingScreen } from "@/components/game-ui/EndingScreen";
import { DataItemEditorProps } from "../dataEditors";
import { EditorHeading } from "../EditorHeading";
import { Container, Typography } from "@mui/material";


type Props = DataItemEditorProps<Ending> & {
    gameDesign: GameDesign;
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
        const { options, data, updateData, gameDesign } = this.props
        const property = field.key as keyof Ending;

        return this.setState(getModification(value, field), () => {
            if (options.autoSave && property !== 'id') {
                const isExistingId = listIds(gameDesign.endings).includes(this.state.id)
                if (data && isExistingId) {
                    updateData(this.currentData)
                }
            }
        })
    }


    render() {
        const { gameDesign, updateData, options } = this.props

        return (
            <article>
                <EditorHeading heading="Ending Editor" itemId={this.props.data?.id} />

                <StorageMenu
                    type="ending"
                    update={() => updateData(this.currentData)}
                    deleteItem={this.props.deleteData}
                    existingIds={listIds(gameDesign.endings)}
                    data={this.currentData}
                    originalId={this.props.data?.id}
                    reset={() => this.setState(this.initialState)}
                    options={options}
                />

                <SchemaForm
                    formLegend="Ending Config"
                    data={this.currentData}
                    schema={EndingSchema}
                    changeValue={(value, field) => { this.handleUpdate(value, field) }}
                    options={{
                        imageId: imageService.list()
                    }}
                    fieldWrapperProps={{
                        spacing: 2,
                    }}
                    containerProps={{
                        padding: 1,
                        marginY: 1,
                        maxWidth: 'sm',
                        sx: {
                            backgroundColor: 'grey.100',
                        }
                    }}
                />

                <Container>
                    <Typography variant="h5" component='p'>Preview</Typography>
                    <EndingScreen ending={this.currentData} inline={true} />
                </Container>

            </article>
        )
    }
}