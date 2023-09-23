import { Consequence, ImmediateConsequence, Sequence, Stage } from "@/definitions";
import { Stack, Typography } from "@mui/material";
import { useState } from "react";
import { ConsequenceDialog } from "./ConsequenceDialog";
import { OrderDialog } from "./OrderDialog";
import { StageFlow } from "./StageFlow";
import { ListEditor } from "../ListEditor";
import { makeBlankStage } from "../defaults";

interface Props {
    sequence: Sequence
    changeConsequence: { (consequence: Consequence, stageIndex: number, consequenceIndex: number): void }
    changeStages: { (stages: Stage[]): void }
    changeConsequenceList: { (newList: ImmediateConsequence[], stageIndex: number): void }
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

export const SequenceFlow = ({ sequence, changeStages, changeConsequence, changeConsequenceList }: Props) => {

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
            <ListEditor tight
                list={sequence.stages}
                describeItem={(stage, stageIndex) => (
                    <StageFlow key={stageIndex}
                        stage={stage}
                        stageIndex={stageIndex}
                        actorIds={actorIds}
                        changeConsequenceList={changeConsequenceList}
                        setConsequenceParams={setConsequenceParams}
                        setOrderParams={setOrderParams}
                    />
                )}
                controlPosition="above"
                mutateList={changeStages}
                createItem={makeBlankStage}
                insertText={`INSERT NEW STAGE`}
                deleteText={`REMOVE STAGE`}
            />


            {consequenceParams && (
                <ConsequenceDialog
                    sequenceId={sequence.id}
                    changeConsequence={changeConsequence}
                    index={consequenceParams.index}
                    stage={consequenceParams.stage}
                    close={() => { setConsequenceParams(undefined) }}
                />
            )}

            {orderParams && (
                <OrderDialog
                    sequenceId={sequence.id}
                    {...orderParams}
                    close={() => { setOrderParams(undefined) }}
                />
            )}

        </>
    )
}