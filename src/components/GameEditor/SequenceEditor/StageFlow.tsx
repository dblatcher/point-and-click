import { ImmediateConsequence, Order, Stage } from "@/definitions";
import { Narrative } from "@/definitions/BaseTypes";
import { insertAt } from "@/lib/util";
import { Box, Button, Dialog, DialogContent, Grid, IconButton, Stack } from "@mui/material";
import { useState } from "react";
import { ArrayControl } from "../ArrayControl";
import { PickConsequenceTypeDialogue } from "../PickConsequenceTypeDialogue";
import { EditorBox } from "../EditorBox";
import { NarrativeEditor } from "../NarrativeEditor";
import { OrderTypeButtons } from "../OrderTypeButtons";
import { getDefaultOrder, makeNewConsequence } from "../defaults";
import { ClearOutlinedIcon } from "../material-icons";
import { ConsequenceCard } from "./ConsequenceCard";
import { OrderCard } from "./OrderCard";


interface Props {
    stage: Stage
    stageIndex: number
    actorIds: string[]
    changeConsequenceList: { (newList: ImmediateConsequence[], stageIndex: number): void }
    setConsequenceParams: { (params: ConsequenceDialogParams): void }
    setOrderParams: { (params: OrderDialogParams): void }
    changeOrderList: { (newList: Order[], stageIndex: number, actorId: string): void }
    setAddActorParams: { (params: { stage: number }): void }
    removeActorFromAll: { (actorId: string): void }
    changeConsequenceNarrative: { (newNarrative: Narrative | undefined, stageIndex: number): void }
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
    changeOrderList, removeActorFromAll, changeConsequenceNarrative,
}: Props) => {

    const [insertConsequenceDialogIndex, setInsertConsequenceDialogIndex] = useState<number | undefined>(undefined)

    return (
        <Box>
            <Grid container>
                <Grid item display={'flex'}>
                    <EditorBox title="consequences" boxProps={{ minWidth: 280 }}>
                        <Stack spacing={0} paddingY={2}>
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
                                        width={230}
                                    />
                                )}
                                mutateList={(newList) => {
                                    changeConsequenceList(newList, stageIndex)
                                }}
                                customInsertFunction={(index) => {
                                    setInsertConsequenceDialogIndex(index)
                                }}
                                createButtonPlacement="END"
                                noMoveButtons
                                color="secondary"
                            />

                        </Stack>
                    </EditorBox>
                </Grid>

                <PickConsequenceTypeDialogue
                    open={typeof insertConsequenceDialogIndex === 'number'} onClose={() => setInsertConsequenceDialogIndex(undefined)}
                    immediateOnly
                    handleChoice={type => {
                        if (typeof insertConsequenceDialogIndex === 'number') {
                            changeConsequenceList(insertAt(insertConsequenceDialogIndex, makeNewConsequence(type) as ImmediateConsequence, stage.immediateConsequences ?? []), stageIndex)
                            setConsequenceParams({
                                stage: stageIndex,
                                index: insertConsequenceDialogIndex,
                            })
                        }
                        setInsertConsequenceDialogIndex(undefined)
                    }} />

                {actorIds.map((actorId) => (
                    <Grid item key={actorId} display={'flex'} >
                        <EditorBox title={actorId}
                            boxProps={{ minWidth: 260 }}
                            barContent={(
                                <IconButton size="small"
                                    onClick={() => { removeActorFromAll(actorId) }}
                                >
                                    <ClearOutlinedIcon />
                                </IconButton>
                            )}
                        >
                            <Box paddingY={2}>
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
                                            width={220}
                                        />
                                    )}
                                    mutateList={(newList) => { changeOrderList(newList, stageIndex, actorId) }}
                                    customCreateButton={index => (
                                        <OrderTypeButtons
                                            handler={(type) => () => {
                                                changeOrderList(
                                                    insertAt(index, getDefaultOrder(type), stage.actorOrders?.[actorId] ?? []), stageIndex, actorId
                                                )
                                                setOrderParams({
                                                    stage: stageIndex,
                                                    actorId,
                                                    index,
                                                })
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                        </EditorBox>
                    </Grid>
                ))}

                <Grid item display={'flex'} flexDirection={'column'} justifyContent={'flex-end'} padding={2} gap={5}>
                    <Button variant="outlined"
                        onClick={() => { setAddActorParams({ stage: stageIndex }) }}>
                        other actor
                    </Button>
                    <NarrativeEditor narrative={stage.narrative} update={(newNarrative) => changeConsequenceNarrative(newNarrative, stageIndex)} />
                </Grid>
            </Grid>
        </Box>
    )
}