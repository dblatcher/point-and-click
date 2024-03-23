import { StringInput } from "@/components/SchemaForm/StringInput";
import { Consequence, ImmediateConsequence, Order, Sequence } from "@/definitions";
import { ImmediateConsequenceSchema } from "@/definitions/Consequence";
import { cloneData } from "@/lib/clone";
import { Grid } from "@mui/material";
import { DeleteDataItemButton } from "../DeleteDataItemButton";
import { EditorHeading } from "../EditorHeading";
import { SequenceFlow } from "./SequenceFlow";
import { useGameDesign } from "@/context/game-design-context";


type Props = {
    data: Sequence;
    isSubSection?: boolean;
}


export const SequenceEditor = (props: Props) => {
    const { performUpdate } = useGameDesign()

    const updateFromPartial = (input: Partial<Sequence> | { (state: Sequence): Partial<Sequence> }) => {
        const { data } = props
        const modification = (typeof input === 'function')
            ? input(cloneData(data)) : input
        performUpdate('sequences', { ...data, ...modification })
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
        })
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


    const { isSubSection, data: sequence } = props
    return (
        <article>
            {isSubSection
                ? (<>
                    <h3>Edit sequence: </h3>
                    <div>ID: <b>{sequence?.id}</b></div>
                    <StringInput label="description" value={sequence.description || ''}
                        inputHandler={(description) => {
                            updateFromPartial({ description })
                        }}
                    />
                </>)
                : (<>
                    <EditorHeading heading="Sequence Editor" itemId={sequence?.id ?? '[new]'} >
                        <DeleteDataItemButton
                            dataItem={sequence}
                            buttonProps={{ variant: 'outlined' }}
                            itemType='sequences'
                            itemTypeName="sequence" />
                    </EditorHeading>

                    <Grid container spacing={4}>
                        <Grid item xs={8}>
                            <StringInput label="description" value={sequence.description || ''}
                                inputHandler={(description) => {
                                    updateFromPartial({ description })
                                }}
                            />
                        </Grid>
                    </Grid>
                </>)
            }

            <SequenceFlow
                sequence={props.data}
                changeConsequence={changeConsequence}
                changeStages={(stages) => { updateFromPartial({ stages }) }}
                changeConsequenceList={changeConsequenceList}
                changeOrder={changeOrder}
                changeOrderList={changeOrderList}
            />
        </article>
    )

}