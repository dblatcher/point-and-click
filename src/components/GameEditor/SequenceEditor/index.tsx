import { useGameDesign } from "@/context/game-design-context";
import { Consequence, ImmediateConsequence, Order, Sequence } from "point-click-lib";
import { Narrative } from "point-click-lib";
import { ImmediateConsequenceSchema } from "point-click-lib";
import { cloneData } from "@/lib/clone";
import { patchMember } from "@/lib/update-design";
import { Grid } from "@mui/material";
import { DelayedStringInput } from "../DelayedStringInput";
import { EditorHeading } from "../layout/EditorHeading";
import { ItemEditorHeaderControls } from "../game-item-components/ItemEditorHeaderControls";
import { SequenceFlow } from "./SequenceFlow";


type Props = {
    data: Sequence;
    heading?: 'main' | 'externalSequence'
    handleChoiceSequenceChange?: { (sequence: Sequence): void }
}


export const SequenceEditor = (props: Props) => {
    const { applyModification, gameDesign } = useGameDesign()

    const updateFromPartial = (
        input: Partial<Sequence> | { (state: Sequence): Partial<Sequence> },
        description?: string
    ) => {
        const { data, handleChoiceSequenceChange } = props
        const modification: Partial<Sequence> = (typeof input === 'function')
            ? input(cloneData(data)) : input

        if (handleChoiceSequenceChange) {
            return handleChoiceSequenceChange({ ...data, ...modification })
        }

        applyModification(
            description ?? `update sequence ${data.id}`,
            { sequences: patchMember(data.id, modification, gameDesign.sequences) }
        )
    }

    const changeOrder = (order: Order, stageIndex: number, actorId: string, orderIndex: number) => {
        updateFromPartial(state => {
            const { stages } = state
            const actorOrders = stages[stageIndex]?.actorOrders
            if (!actorOrders) { return {} }
            const ordersForActor = actorOrders[actorId]
            if (!ordersForActor) { return {} }
            ordersForActor.splice(orderIndex, 1, order)
            return { stages }
        })
    }

    const changeOrderList = (newList: Order[], stageIndex: number, actorId: string) => {
        updateFromPartial(state => {
            const { stages } = state
            const stage = stages[stageIndex]
            if (!stage) { return {} }
            if (!stage.actorOrders) { stage.actorOrders = {} }
            stage.actorOrders[actorId] = newList
            return { stages }
        })
    }

    const changeConsequence = (consequence: Consequence, stageIndex: number, consequenceIndex: number) => {
        const isImmediateConsequence = ImmediateConsequenceSchema.safeParse(consequence)
        if (!isImmediateConsequence.success) {
            console.warn('not immediate', consequence)
            return
        }

        updateFromPartial(state => {
            const { stages } = state
            const immediateConsequences = stages[stageIndex]?.immediateConsequences
            if (!immediateConsequences) { return {} }
            immediateConsequences.splice(consequenceIndex, 1, isImmediateConsequence.data)
            return { stages }
        }, `sequence ${props.data.id}: change consequece in stage ${stageIndex + 1}`)
    }

    const changeConsequenceList = (newList: ImmediateConsequence[], stageIndex: number) => {
        updateFromPartial(state => {
            const { stages } = state
            const stage = stages[stageIndex]
            if (!stage) { return {} }
            stage.immediateConsequences = newList
            return { stages }
        })
    }

    const changeConsequenceNarrative = (newNarrative: Narrative | undefined, stageIndex: number) => {
        updateFromPartial(state => {
            const { stages } = state
            const stage = stages[stageIndex]
            if (!stage) { return {} }
            stage.narrative = newNarrative
            return { stages }
        }, `sequence ${props.data.id}: change narrative for stage ${stageIndex + 1}`)
    }

    const { data: sequence, heading } = props

    const descriptionField = <DelayedStringInput label="description" value={sequence.description || ''}
        inputHandler={(description) => {
            updateFromPartial({ description })
        }}
    />

    return (
        <article>

            {heading === 'main' && (<>
                <EditorHeading heading="Sequence Editor" itemId={sequence?.id ?? '[new]'} >
                    <ItemEditorHeaderControls
                        dataItem={sequence}
                        itemType='sequences'
                        itemTypeName="sequence" />
                </EditorHeading>

                <Grid container spacing={4}>
                    <Grid item xs={8}>
                        {descriptionField}
                    </Grid>
                </Grid>
            </>)}

            {heading === 'externalSequence' &&
                (<>
                    <h3>Edit external sequence: </h3>
                    <div>ID: <b>{sequence?.id}</b></div>
                    {descriptionField}
                </>)
            }

            <SequenceFlow
                sequence={props.data}
                changeConsequence={changeConsequence}
                changeStages={(stages) => { updateFromPartial({ stages }) }}
                changeConsequenceList={changeConsequenceList}
                changeOrder={changeOrder}
                changeOrderList={changeOrderList}
                changeConsequenceNarrative={changeConsequenceNarrative}
            />
        </article>
    )

}