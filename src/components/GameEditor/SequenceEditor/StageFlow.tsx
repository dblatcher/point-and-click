import { ImmediateConsequence, Order, Stage } from "@/definitions";
import { Box, Button, Grid, Stack } from "@mui/material";
import { ArrayControl } from "../ArrayControl";
import { EditorBox } from "../EditorBox";
import { getDefaultOrder, makeNewConsequence } from "../defaults";
import { OrderCard } from "./OrderCard";
import { ConsequenceCard } from "./ConsequenceCard";

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


    return (
        <Box>
            <Grid container>
                <Grid item display={'flex'}>
                    <EditorBox title="consequences">
                        <Stack spacing={0}>

                            <ArrayControl
                                list={stage.immediateConsequences ?? []}
                                describeItem={(consequence, consequenceIndex) => (
                                    <ConsequenceCard
                                        consequence={consequence}
                                        handleEditButton={() => {
                                            setConsequenceParams({
                                                stage: stageIndex,
                                                index: consequenceIndex,
                                            })
                                        }}
                                    />
                                )}
                                mutateList={(newList) => {
                                    changeConsequenceList(newList, stageIndex)
                                }}
                                createItem={() => (
                                    makeNewConsequence('changeStatus') as ImmediateConsequence
                                )}
                                createButton="END"
                                noMoveButtons
                                color="secondary"
                            />

                        </Stack>
                    </EditorBox>
                </Grid>

                {actorIds.map((actorId) => (
                    <Grid item key={actorId} display={'flex'} >
                        <EditorBox title={actorId} boxProps={{ minWidth: 280 }}>
                            <ArrayControl
                                color="secondary"
                                list={stage.actorOrders?.[actorId] ?? []}
                                describeItem={(order, orderIndex) => (
                                    <OrderCard
                                        order={order}
                                        handleEditButton={() => {
                                            setOrderParams({
                                                stage: stageIndex,
                                                actorId,
                                                index: orderIndex,
                                            })
                                        }}
                                    />
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
        </Box>
    )
}