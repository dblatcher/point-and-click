import { insertAt } from "@/lib/util";
import { Button } from "@mui/material";
import { Consequence, Order, Sequence, Stage } from "point-click-lib";
import { useState } from "react";
import { ArrayControl } from "../ArrayControl";
import { makeBlankStage } from "../defaults";
import { AddIcon } from "../material-icons";
import { PickActorDialog } from "../PickActorDialog";
import { ConsequenceDialog } from "./ConsequenceDialog";
import { OrderDialog } from "./OrderDialog";
import { StageFlow } from "./StageFlow";

interface Props {
    sequence: Sequence
    changeConsequence: { (consequence: Consequence, stageIndex: number, consequenceIndex: number): void }
    changeStages: { (stages: Stage[]): void }
    changeOrder: { (order: Order, stageIndex: number, actorId: string, orderIndex: number): void }
    modifyStage: { (mod: Partial<Stage>, stageIndex: number, description: string): void }
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

type AddActorParams = {
    stage: number
}

const getConsequenceFromParams = (consequenceParams: ConsequenceDialogParams | undefined, sequence: Sequence): Consequence | undefined =>
    consequenceParams ? sequence.stages[consequenceParams.stage].immediateConsequences?.[consequenceParams.index] : undefined

export const SequenceFlow = ({
    sequence,
    changeStages,
    changeConsequence,
    changeOrder,
    modifyStage,
}: Props) => {
    const [consequenceParams, setConsequenceParams] = useState<ConsequenceDialogParams | undefined>(undefined)
    const [orderParams, setOrderParams] = useState<OrderDialogParams | undefined>(undefined)
    const [addActorParams, setAddActorParams] = useState<AddActorParams | undefined>(undefined)

    const actorIds = sequence.stages.reduce<string[]>((list, stage) => {
        if (!stage.actorOrders) {
            return list
        }
        const newKeys = Object.keys(stage.actorOrders).filter(key => !list.includes(key))
        return [...list, ...newKeys]
    }, [])

    const addActor = (actorId: string, stageIndex: number) => {
        const stage = sequence.stages[stageIndex];
        if (!stage) { return }
        modifyStage({
            actorOrders: {
                ...stage.actorOrders,
                [actorId]: []
            }
        }, stageIndex, `add order list for ${actorId}`)
    }

    const removeActorFromAll = (actorId: string) => {
        const stagesCopy = sequence.stages.map(stage => ({ ...stage }))
        stagesCopy.forEach(stage => {
            if (stage.actorOrders?.[actorId]) {
                delete stage.actorOrders[actorId]
            }
        })
        changeStages(stagesCopy)
    }

    const consequenceToEdit = getConsequenceFromParams(consequenceParams, sequence)

    return (
        <>
            <ArrayControl
                stackProps={{ gap: 4 }}
                list={sequence.stages}
                describeItem={(stage, stageIndex) => (
                    <StageFlow key={stageIndex}
                        stage={stage}
                        stageIndex={stageIndex}
                        actorIds={actorIds}
                        setConsequenceParams={setConsequenceParams}
                        setOrderParams={setOrderParams}
                        setAddActorParams={setAddActorParams}
                        removeActorFromAll={removeActorFromAll}
                        modifyStage={modifyStage}
                    />
                )}
                mutateList={changeStages}
                customCreateButton={(index) => (
                    <Button
                        sx={{ marginX: 2 }}
                        startIcon={<AddIcon />}
                        variant="contained"
                        onClick={() => changeStages(insertAt(index, makeBlankStage(), sequence.stages))}
                    >New stage</Button>
                )}
            />

            {(consequenceParams && consequenceToEdit) && (
                <ConsequenceDialog
                    immediateOnly
                    consequence={consequenceToEdit}
                    handleConsequenceUpdate={(updatedConsequence) => {
                        changeConsequence(updatedConsequence, consequenceParams.stage, consequenceParams.index)
                    }}
                    close={() => { setConsequenceParams(undefined) }}
                />
            )}

            {orderParams && (
                <OrderDialog
                    order={sequence?.stages[orderParams.stage].actorOrders?.[orderParams.actorId]?.[orderParams.index]}
                    {...orderParams}
                    changeOrder={(newOrder) => { changeOrder(newOrder, orderParams.stage, orderParams.actorId, orderParams.index) }}
                    close={() => { setOrderParams(undefined) }}
                />
            )}

            {addActorParams && (
                <PickActorDialog
                    isOpen={true}
                    excluded={actorIds}
                    close={() => { setAddActorParams(undefined) }}
                    onSelect={(actorId) => { addActor(actorId, addActorParams.stage) }}
                />
            )}
        </>
    )
}