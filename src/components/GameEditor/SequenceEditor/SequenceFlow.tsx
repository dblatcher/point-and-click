import { Consequence, ImmediateConsequence, Order, Sequence, Stage } from "@/definitions";
import { useState } from "react";
import { ArrayControl } from "../ArrayControl";
import { makeBlankStage } from "../defaults";
import { ConsequenceDialog } from "./ConsequenceDialog";
import { OrderDialog } from "./OrderDialog";
import { StageFlow } from "./StageFlow";

interface Props {
    sequence: Sequence
    changeConsequence: { (consequence: Consequence, stageIndex: number, consequenceIndex: number): void }
    changeStages: { (stages: Stage[]): void }
    changeConsequenceList: { (newList: ImmediateConsequence[], stageIndex: number): void }
    changeOrder: { (order: Order, stageIndex: number, actorId: string, orderIndex: number): void }
    changeOrderList: { (newList: Order[], stageIndex: number, actorId: string): void }
}

type ConsequenceDialogParams = {
    stage: number
    index: number
}

type OrderDialogParams = {
    stage: number;
    actorId: string;
    index: number;
}

export const SequenceFlow = ({ sequence, changeStages, changeConsequence, changeConsequenceList, changeOrder, changeOrderList }: Props) => {

    const [consequenceParams, setConsequenceParams] = useState<ConsequenceDialogParams | undefined>(undefined)
    const [orderParams, setOrderParams] = useState<OrderDialogParams | undefined>(undefined)

    const actorIds = sequence.stages.reduce<string[]>((list, stage) => {
        if (!stage.actorOrders) {
            return list
        }

        const newKeys = Object.keys(stage.actorOrders).filter(key => !list.includes(key))
        return [...list, ...newKeys]
    }, [])

    return (
        <>
            <ArrayControl
                list={sequence.stages}
                describeItem={(stage, stageIndex) => (
                    <StageFlow key={stageIndex}
                        stage={stage}
                        stageIndex={stageIndex}
                        actorIds={actorIds}
                        changeConsequenceList={changeConsequenceList}
                        setConsequenceParams={setConsequenceParams}
                        setOrderParams={setOrderParams}
                        changeOrderList={changeOrderList}
                    />
                )}
                mutateList={changeStages}
                createItem={makeBlankStage}
                insertText={`INSERT NEW STAGE`}
                deleteText={`REMOVE STAGE`}
            />


            {consequenceParams && (
                <ConsequenceDialog
                    sequenceId={sequence.id}
                    {...consequenceParams}
                    changeConsequence={changeConsequence}
                    close={() => { setConsequenceParams(undefined) }}
                />
            )}

            {orderParams && (
                <OrderDialog
                    sequenceId={sequence.id}
                    {...orderParams}
                    changeOrder={(newOrder) => { changeOrder(newOrder, orderParams.stage, orderParams.actorId, orderParams.index) }}
                    close={() => { setOrderParams(undefined) }}
                />
            )}

        </>
    )
}