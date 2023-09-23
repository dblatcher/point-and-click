import { useGameDesign } from "@/context/game-design-context";
import { ImmediateConsequence, Order, Stage } from "@/definitions";
import { Box, Button, Grid, Stack } from "@mui/material";
import { ArrayControl } from "../ArrayControl";
import { EditorBox } from "../EditorBox";
import { getDefaultOrder, makeNewConsequence } from "../defaults";

interface Props {
    stage: Stage
    stageIndex: number
    actorIds: string[]
    changeConsequenceList: { (newList: ImmediateConsequence[], stageIndex: number): void }
    setConsequenceParams: { (params: ConsequenceDialogParams): void }
    setOrderParams: { (params: OrderDialogParams): void }
    changeOrderList: { (newList: Order[], stageIndex: number, actorId: string): void }
    setAddActorParams: { (params: { stage: number }): void }
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

export const StageFlow = ({
    stage, stageIndex, actorIds,
    changeConsequenceList,
    setConsequenceParams, setOrderParams, setAddActorParams,
    changeOrderList
}: Props) => {


    const { gameDesign } = useGameDesign()

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
        <Box>
            <Grid container>
                <Grid item display={'flex'}>
                    <EditorBox title="consequences">
                        <Stack spacing={0}>
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
                </Grid>

                {actorIds.map((actorId) => (
                    <Grid item key={actorId} display={'flex'} >
                        <EditorBox title={actorId} boxProps={{ minWidth: 240 }}>
                            <ArrayControl
                                color="secondary"
                                list={stage.actorOrders?.[actorId] ?? []}
                                describeItem={(order, orderIndex) => (
                                    <EditorBox key={orderIndex} title={order.type} themePalette="secondary" >
                                        <Button onClick={() => {
                                            setOrderParams({
                                                stage: stageIndex,
                                                actorId,
                                                index: orderIndex,
                                            })
                                        }}>edit</Button>
                                    </EditorBox>
                                )}
                                mutateList={(newList) => { changeOrderList(newList, stageIndex, actorId) }}
                                createItem={() => getDefaultOrder('say')}
                            />
                        </EditorBox>
                    </Grid>
                ))}

                <Grid item display={'flex'}>
                    <Box padding={1} alignSelf={'center'}>
                        <Button variant="outlined"
                            onClick={() => { setAddActorParams({ stage: stageIndex }) }}>
                            other actor
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            <hr></hr>
        </Box>
    )
}