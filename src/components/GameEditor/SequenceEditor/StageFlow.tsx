import { ImmediateConsequence, Stage } from "@/definitions";
import { Box, Button, Stack } from "@mui/material";
import { EditorBox } from "../EditorBox";
import { makeNewConsequence } from "../defaults";

interface Props {
    stage: Stage
    stageIndex: number
    actorIds: string[]
    changeConsequenceList: { (newList: ImmediateConsequence[], stageIndex: number): void }
    setConsequenceParams: { (params: ConsequenceDialogParams): void }
    setOrderParams: { (params: OrderDialogParams): void }
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

export const StageFlow = ({ stage, stageIndex, changeConsequenceList, actorIds, setConsequenceParams, setOrderParams }: Props) => {

    const exisingConsequences: ImmediateConsequence[] = stage.immediateConsequences ?? []

    const addConsequence = (stageIndex: number) => {
        changeConsequenceList([
            ...exisingConsequences,
            makeNewConsequence('changeStatus') as ImmediateConsequence
        ], stageIndex)
    }

    const removeConsequence = (stageIndex: number, consequenceIndex: number) => {
        changeConsequenceList([
            ...exisingConsequences.slice(0, consequenceIndex),
            ...exisingConsequences.slice(consequenceIndex + 1),
        ], stageIndex)
    }

    return (
        <Box key={stageIndex}>
            <Stack direction={'row'} spacing={2}>
                <EditorBox title="consequences">
                    <Stack spacing={1}>
                        {stage.immediateConsequences?.map((consequence, consequnceIndex) => (
                            <EditorBox key={consequnceIndex} title={consequence.type} themePalette="secondary">
                                <Button onClick={() => {
                                    setConsequenceParams({
                                        stage: stageIndex,
                                        index: consequnceIndex,
                                    })
                                }}>edit</Button>
                                <Button onClick={() => { removeConsequence(stageIndex, consequnceIndex) }}>delete</Button>
                            </EditorBox>
                        ))}

                        <Button variant="outlined" color={"secondary"} onClick={() => { addConsequence(stageIndex) }} >add consequence</Button>
                    </Stack>
                </EditorBox>

                {actorIds.map((actorId) => (
                    <EditorBox title={actorId} key={actorId} boxProps={{ minWidth: 150 }}>
                        <Stack spacing={1}>
                            {(stage.actorOrders?.[actorId] ?? []).map((order, orderIndex) => (
                                <EditorBox key={orderIndex} title={order.type} themePalette="secondary" >
                                    <Button onClick={() => {
                                        setOrderParams({
                                            stage: stageIndex,
                                            actorId,
                                            index: orderIndex,
                                        })
                                    }}>edit</Button>
                                </EditorBox>
                            ))}
                        </Stack>
                    </EditorBox>
                ))}

                <Button>
                    Add orders for other actor
                </Button>
            </Stack>
        </Box>
    )
}