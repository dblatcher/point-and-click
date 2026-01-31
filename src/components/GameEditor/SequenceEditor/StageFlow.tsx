import { insertAt } from "@/lib/util";
import { Box, Button, Checkbox, Grid, IconButton } from "@mui/material";
import { ImmediateConsequence, Stage } from "point-click-lib";
import { useState } from "react";
import { ArrayControl } from "../ArrayControl";
import { NarrativeEditor } from "../NarrativeEditor";
import { OrderTypeButtons } from "../OrderTypeButtons";
import { PickConsequenceTypeDialogue } from "../PickConsequenceTypeDialogue";
import { getDefaultOrder, makeNewConsequence } from "../defaults";
import { EditorBox } from "../layout/EditorBox";
import { AddIcon, ClearOutlinedIcon, StarIcon, StarOutlineIcon } from "../material-icons";
import { ConsequenceCard } from "./ConsequenceCard";
import { OrderCard } from "./OrderCard";


interface Props {
    stage: Stage
    stageIndex: number
    actorIds: string[]
    setConsequenceParams: { (params: ConsequenceDialogParams): void }
    setOrderParams: { (params: OrderDialogParams): void }
    setAddActorParams: { (params: { stage: number }): void }
    removeActorFromAll: { (actorId: string): void }
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

export const StageFlow = ({
    stage, stageIndex, actorIds,
    setConsequenceParams, setOrderParams, setAddActorParams,
    removeActorFromAll,
    modifyStage,
}: Props) => {

    const [insertConsequenceDialogIndex, setInsertConsequenceDialogIndex] = useState<number | undefined>(undefined)

    return (
        <Box>
            <Grid container>
                <Grid item display={'flex'}>
                    <EditorBox boxProps={{ minWidth: 280 }} contentBoxProps={{ paddingY: 3, paddingX: 1 }}>
                        {!stage.immediateConsequences?.length
                            ? <Button
                                color="secondary"
                                variant="contained"
                                fullWidth
                                startIcon={<AddIcon />}
                                onClick={() => setInsertConsequenceDialogIndex(0)}
                            >Add Consequences</Button>
                            : <ArrayControl
                                stackProps={{ paddingTop: 8 }}
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
                                        width={250}
                                    />
                                )}
                                mutateList={(newList) =>
                                    modifyStage({ immediateConsequences: newList }, stageIndex, 'change consequences')
                                }
                                customInsertFunction={(index) => {
                                    setInsertConsequenceDialogIndex(index)
                                }}
                                createButtonPlacement="END"
                                noMoveButtons
                                color="secondary"
                            />
                        }
                        <NarrativeEditor
                            buttonProps={{
                                sx: { marginTop: 4 }
                            }}
                            narrative={stage.narrative}
                            update={(newNarrative) => modifyStage({ narrative: newNarrative }, stageIndex, 'update narrative')} />
                    </EditorBox>
                </Grid>

                <PickConsequenceTypeDialogue
                    open={typeof insertConsequenceDialogIndex === 'number'} onClose={() => setInsertConsequenceDialogIndex(undefined)}
                    immediateOnly
                    handleChoice={type => {
                        if (typeof insertConsequenceDialogIndex === 'number') {
                            modifyStage({
                                immediateConsequences: insertAt(insertConsequenceDialogIndex, makeNewConsequence(type) as ImmediateConsequence, stage.immediateConsequences)
                            }, stageIndex, `add ${type} consequence`)
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
                                <>
                                    <Checkbox
                                        title={`camera follows ${actorId} during stage`}
                                        aria-label={actorId === stage.actorToFollow ? `stop camera following ${actorId} during stage` : `make camera follow ${actorId} during stage`}
                                        onChange={() => {
                                            if (actorId === stage.actorToFollow) {
                                                return modifyStage({ actorToFollow: undefined }, stageIndex, `unfollow ${actorId}`)
                                            }
                                            return modifyStage({ actorToFollow: actorId }, stageIndex, `follow ${actorId}`)
                                        }}
                                        checked={actorId === stage.actorToFollow}
                                        icon={<StarOutlineIcon color='secondary' />}
                                        checkedIcon={<StarIcon color='secondary' />}
                                    />

                                    <IconButton size="small"
                                        onClick={() => { removeActorFromAll(actorId) }}
                                    >
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </>
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
                                            width={200}
                                        />
                                    )}
                                    mutateList={(newList) => {
                                        modifyStage({
                                            actorOrders: {
                                                ...stage.actorOrders,
                                                [actorId]: newList,
                                            }
                                        }, stageIndex, `change order list for ${actorId}`)
                                    }}
                                    customCreateButton={index => (
                                        <OrderTypeButtons
                                            handler={(type) => () => {
                                                modifyStage(
                                                    {
                                                        actorOrders: {
                                                            ...stage.actorOrders,
                                                            [actorId]: insertAt(index, getDefaultOrder(type), stage.actorOrders?.[actorId] ?? [])
                                                        }
                                                    },
                                                    stageIndex,
                                                    `insert ${type} order for ${actorId}`
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

                <Grid item display={'flex'} flexDirection={'column'} justifyContent={'center'} padding={2} gap={5}>
                    <Button variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => { setAddActorParams({ stage: stageIndex }) }}>
                        other actor
                    </Button>
                </Grid>
            </Grid>
        </Box >
    )
}