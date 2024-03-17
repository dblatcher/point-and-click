import { StringInput } from "@/components/SchemaForm/StringInput";
import { Consequence, GameDesign, ImmediateConsequence, Order, Sequence } from "@/definitions";
import { ImmediateConsequenceSchema } from "@/definitions/Consequence";
import { cloneData } from "@/lib/clone";
import { listIds } from "@/lib/util";
import { Stack } from "@mui/material";
import { Component } from "react";
import { EditorOptions } from "..";
import { EditorBox } from "../EditorBox";
import { EditorHeading } from "../EditorHeading";
import { StorageMenu } from "../StorageMenu";
import { makeBlankSequence } from "../defaults";
import { SequenceFlow } from "./SequenceFlow";


type Props = {

    data: Sequence;
    updateData: (data: Sequence) => void;
    deleteData: (index: number) => void;
    options: EditorOptions;

    gameDesign: GameDesign;
    sequenceId?: string;
    isSubSection?: boolean;
}


export class SequenceEditor extends Component<Props> {

    constructor(props: Props) {
        super(props)
        this.changeOrder = this.changeOrder.bind(this)
        this.changeOrderList = this.changeOrderList.bind(this)
        this.changeConsequence = this.changeConsequence.bind(this)
        this.changeConsequenceList = this.changeConsequenceList.bind(this)
        this.updateFromPartial = this.updateFromPartial.bind(this)
    }

    get currentData(): Sequence {
        return cloneData(this.props.data)
    }

    updateFromPartial(input: Partial<Sequence> | { (state: Sequence): Partial<Sequence> }) {
        const { data, updateData } = this.props
        const modification = (typeof input === 'function')
            ? input(this.currentData) : input
        updateData({ ...data, ...modification })
    }

    changeOrder(order: Order, stageIndex: number, actorId: string, orderIndex: number) {
        this.updateFromPartial(state => {
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
        this.updateFromPartial(state => {
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

        this.updateFromPartial(state => {
            const { stages } = state
            const immediateConsequences = stages[stageIndex]?.immediateConsequences
            if (!immediateConsequences) { return {} }
            immediateConsequences.splice(consequenceIndex, 1, isImmediateConsequence.data)
            return { stages }
        })
    }

    changeConsequenceList(newList: ImmediateConsequence[], stageIndex: number) {
        this.updateFromPartial(state => {
            const { stages } = state
            const stage = stages[stageIndex]
            if (!stage) { return {} }
            stage.immediateConsequences = newList
            return { stages }
        })
    }

    render() {
        const { gameDesign, sequenceId, deleteData, options, isSubSection, data: sequence } = this.props
        return (
            <article>
                {isSubSection
                    ? (<>
                        <h3>Edit sequence: </h3>
                        <div>ID: <b>{sequence?.id}</b></div>
                        <StringInput label="description" value={sequence.description || ''}
                            inputHandler={(description) => {
                                this.updateFromPartial({ description })
                            }}
                        />
                    </>)
                    : (<>
                        <EditorHeading heading="Sequence Editor" itemId={sequence?.id ?? '[new]'} />
                        <Stack direction='row' spacing={1}>
                            <EditorBox title="details">
                                <StringInput label="description" value={sequence.description || ''}
                                    inputHandler={(description) => {
                                        this.updateFromPartial({ description })
                                    }}
                                />
                            </EditorBox>

                            <StorageMenu
                                type='sequence'
                                data={this.currentData}
                                originalId={sequenceId}
                                existingIds={listIds(gameDesign.sequences)}
                                reset={() => { }}
                                update={() => { }}
                                deleteItem={deleteData}
                                options={options}
                            />
                        </Stack>
                    </>)
                }

                <SequenceFlow
                    sequence={this.props.data}
                    changeConsequence={this.changeConsequence}
                    changeStages={(stages) => { this.updateFromPartial({ stages }) }}
                    changeConsequenceList={this.changeConsequenceList}
                    changeOrder={this.changeOrder}
                    changeOrderList={this.changeOrderList}
                />
            </article>
        )
    }
}