import { Consequence, GameDesign, ImmediateConsequence, Order, Sequence } from "@/definitions";
import { ImmediateConsequenceSchema } from "@/definitions/Consequence";
import { cloneData } from "@/lib/clone";
import { listIds } from "@/lib/util";
import { Stack } from "@mui/material";
import { Component } from "react";
import { EditorBox } from "../EditorBox";
import { EditorHeading } from "../EditorHeading";
import { StorageMenu } from "../StorageMenu";
import { DataItemEditorProps } from "../dataEditors";
import { makeBlankSequence } from "../defaults";
import { StringInput } from "../formControls";
import { SequenceFlow } from "./SequenceFlow";


type Props = DataItemEditorProps<Sequence> & {
    gameDesign: GameDesign;
    sequenceId?: string;
    isSubSection?: boolean;
}

type ExtraState = {

}
type State = Sequence & ExtraState



export class SequenceEditor extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = this.initialState
        this.changeOrder = this.changeOrder.bind(this)
        this.changeOrderList = this.changeOrderList.bind(this)
        this.changeConsequence = this.changeConsequence.bind(this)
        this.changeConsequenceList = this.changeConsequenceList.bind(this)
        this.setStateWithAutosave = this.setStateWithAutosave.bind(this)
    }

    get initialState(): Sequence {
        const { data } = this.props
        return data ? {
            ...cloneData(data)
        } : makeBlankSequence()
    }

    get currentData(): Sequence {
        const actorData = cloneData(this.state) as State;
        return actorData
    }

    setStateWithAutosave(input: Partial<State> | { (state: State): Partial<State> }) {
        const { options, data, updateData, gameDesign } = this.props

        if (!options.autoSave) {
            return this.setState(input)
        }

        return this.setState(input, () => {
            const isExistingId = listIds(gameDesign.sequences).includes(this.state.id)
            if (data && isExistingId) {
                updateData(this.currentData)
            }
        })
    }

    changeOrder(order: Order, stageIndex: number, actorId: string, orderIndex: number) {
        this.setStateWithAutosave(state => {
            const { stages } = state
            const actorOrders = stages[stageIndex]?.actorOrders
            if (!actorOrders) { return {} }
            const ordersForActor = actorOrders[actorId]
            if (!ordersForActor) { return {} }
            ordersForActor.splice(orderIndex, 1, order)
            return { stages }
        })
    }

    changeOrderList(newList: Order[], stageIndex: number, actorId: string) {
        this.setStateWithAutosave(state => {
            const { stages } = state
            const stage = stages[stageIndex]
            if (!stage) { return {} }
            if (!stage.actorOrders) { stage.actorOrders = {} }
            stage.actorOrders[actorId] = newList
            return { stages }
        })
    }

    changeConsequence(consequence: Consequence, stageIndex: number, consequenceIndex: number) {
        const isImmediateConsequence = ImmediateConsequenceSchema.safeParse(consequence)
        if (!isImmediateConsequence.success) {
            console.warn('not immediate', consequence)
            return
        }

        this.setStateWithAutosave(state => {
            const { stages } = state
            const immediateConsequences = stages[stageIndex]?.immediateConsequences
            if (!immediateConsequences) { return {} }
            immediateConsequences.splice(consequenceIndex, 1, isImmediateConsequence.data)
            return { stages }
        })
    }

    changeConsequenceList(newList: ImmediateConsequence[], stageIndex: number) {
        this.setStateWithAutosave(state => {
            const { stages } = state
            const stage = stages[stageIndex]
            if (!stage) { return {} }
            stage.immediateConsequences = newList
            return { stages }
        })
    }

    render() {
        const { gameDesign, sequenceId, updateData, deleteData, options, isSubSection, data } = this.props
        const { description, id } = this.state

        return (
            <article>

                {isSubSection
                    ? (<>
                        <h3>Edit sequence: </h3>
                        <div>ID: <b>{data?.id}</b></div>
                        <StringInput block label="description" value={description || ''}
                            inputHandler={(description) => {
                                this.setStateWithAutosave({ description })
                            }}
                        />
                    </>)
                    : (<>
                        <EditorHeading heading="Sequence Editor" itemId={data?.id ?? '[new]'} />
                        <Stack direction='row' spacing={1}>
                            <EditorBox title="details">
                                <StringInput block label="id" value={id} // don't autosave when changing ID
                                    inputHandler={(id) => { this.setState({ id }) }}
                                />
                                <StringInput block label="description" value={description || ''}
                                    inputHandler={(description) => {
                                        this.setStateWithAutosave({ description })
                                    }}
                                />
                            </EditorBox>

                            <StorageMenu
                                type='sequence'
                                data={this.currentData}
                                originalId={sequenceId}
                                existingIds={listIds(gameDesign.sequences)}
                                reset={() => this.setState(this.initialState)}
                                update={() => { updateData(this.currentData) }}
                                deleteItem={deleteData}
                                options={options}
                            />
                        </Stack>
                    </>)
                }

                <SequenceFlow
                    sequence={this.state}
                    changeConsequence={this.changeConsequence}
                    changeStages={(stages) => { this.setStateWithAutosave({ stages }) }}
                    changeConsequenceList={this.changeConsequenceList}
                    changeOrder={this.changeOrder}
                    changeOrderList={this.changeOrderList}
                />
            </article>
        )
    }
}