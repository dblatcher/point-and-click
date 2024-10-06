
import { useGameDesign } from "@/context/game-design-context";
import { Sequence } from "@/definitions";
import { ChoiceRefSet, Conversation, ConversationBranch, ConversationChoice } from "@/definitions/Conversation";
import { cloneData } from "@/lib/clone";
import { findById, listIds } from "@/lib/util";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import { useState } from "react";
import { ArrayControl } from "../ArrayControl";
import { EditorHeading } from "../EditorHeading";
import { ItemEditorHeaderControls } from "../ItemEditorHeaderControls";
import { SequenceEditor } from "../SequenceEditor";
import { makeBlankConversationChoice } from "../defaults";
import { ActorsInvolvedList } from "./ActorsInvolvedList";
import { ChoiceDescription } from "./ChoiceDescription";
import { ChoiceEditor } from "./ChoiceEditor";
import { ConversationFlow } from "./ConversationFlow";
import { patchMember } from "@/lib/update-design";

type Props = {
    conversation: Conversation;
}

export const ConversationEditor = (props: Props) => {

    const [openBranchId, setOpenBranchId] = useState<string | undefined>(undefined)
    const [activeChoiceIndex, setActiveChoiceIndex] = useState<number | undefined>(0)
    const [externalSequenceDialogOpen, setExternalSequenceDialogOpen] = useState<boolean>(false)
    const [editOrderDialogBranchId, setEditOrderDialogBranchId] = useState<string | undefined>(undefined)
    const [actorsInvolved, setActorsInvolved] = useState<string[]>([])

    const { gameDesign, performUpdate, applyModification } = useGameDesign()
    const { conversations } = gameDesign
    const { conversation } = props

    const updateFromPartial = (input: Partial<Conversation>, description?: string) => {
        if (listIds(conversations).includes(conversation.id)) {
            applyModification(
                description ?? `update conversation "${conversation.id}"`,
                { conversations: patchMember(conversation.id, input, conversations) }
            )
        }
    }

    const updateChoiceListItem = (
        property: 'enablesChoices' | 'disablesChoices',
        indexOfSet: number,
        newRefSet: ChoiceRefSet,
    ) => {

        const getModifiedBranches = () => {
            const { choice, branches } = getBranchAndChoice()
            if (!choice) { return {} }
            if (!choice[property]) { choice[property] = [] }
            choice[property]?.splice(indexOfSet, 1, newRefSet)
            return { branches }
        }

        updateFromPartial(getModifiedBranches())
    }

    const addChoiceListItem = (
        property: 'enablesChoices' | 'disablesChoices'
    ) => {
        const getModifiedBranches = () => {
            const { choice, branches } = getBranchAndChoice()
            if (!choice) { return {} }
            if (!choice[property]) { choice[property] = [] }
            choice[property]?.push({})
            return { branches }
        }
        updateFromPartial(getModifiedBranches())
    }

    const removeChoiceListItem = (
        property: 'enablesChoices' | 'disablesChoices',
        index: number
    ) => {
        const getModifiedBranches = () => {
            const { choice, branches } = getBranchAndChoice()
            if (!choice || !choice[property]) { return {} }
            choice[property]?.splice(index, 1)
            return { branches }
        }
        updateFromPartial(getModifiedBranches())
    }

    const handleChoiceUpdate = (mod: Partial<ConversationChoice>) => {
        const { choice, branches } = getBranchAndChoice()
        if (!choice) {
            return
        }
        Object.assign(choice, mod)
        updateFromPartial({ branches })
    }

    const addNewBranchAndOpenIt = (branchName: string) => {
        if (!branchName || conversation.branches[branchName]) {
            return
        }
        const getModifiedBranches = () => {
            const { branches } = getBranchAndChoice()
            branches[branchName] = {
                choices: [
                    makeBlankConversationChoice()
                ]
            }
            return { branches }
        }
        updateFromPartial(getModifiedBranches())
        setOpenBranchId(branchName)
        setActiveChoiceIndex(0)
    }

    const mutateChoiceList = (branchKey: string, newList: ConversationChoice[]) => {
        const getModifiedBranches = () => {
            const { branches } = getBranchAndChoice()
            const branch = branches[branchKey];
            if (branch) { branch.choices = newList }
            return { branches }
        }
        updateFromPartial(getModifiedBranches())
    }

    const addNewChoice = (folderId: string): void => {
        const getModifiedBranches = () => {
            const { branches } = getBranchAndChoice()
            const branch = branches[folderId]
            if (!branch) { return {} }
            branch.choices.push(makeBlankConversationChoice())
            return { branches }
        }
        updateFromPartial(getModifiedBranches())
    }

    const addSequence = (sequence: Sequence) => {
        const getModifiedBranches = () => {
            const { choice, branches } = getBranchAndChoice()
            if (choice) {
                choice.sequence = sequence.id
            }
            return { branches }
        }
        updateFromPartial(getModifiedBranches())
        performUpdate('sequences', sequence)
    }

    const getBranchAndChoice = (): { branch?: ConversationBranch; choice?: ConversationChoice, branches: Conversation['branches'] } => {
        const { branches } = cloneData(conversation)
        const result: { branch?: ConversationBranch; choice?: ConversationChoice, branches: Conversation['branches'] } = { branches }
        if (openBranchId) {
            result.branch = branches[openBranchId]
            if (result.branch && typeof activeChoiceIndex === 'number') {
                result.choice = result.branch.choices[activeChoiceIndex]
            }
        }
        return result
    }

    const { choice } = getBranchAndChoice()
    const branchInOrderDialog = editOrderDialogBranchId ? conversation.branches[editOrderDialogBranchId] : undefined
    const externalSequenceForCurrentChoice = choice && findById(choice.sequence, gameDesign.sequences)
    const actorIdsForSequences = actorsInvolved.length === 0 ? gameDesign.actors.filter(a => a.isPlayer).map(a => a.id) : actorsInvolved

    return (
        <Stack component={'article'} spacing={2} >
            <EditorHeading heading={`Conversation Editor`} itemId={conversation.id} >
                <ItemEditorHeaderControls
                    dataItem={conversation}
                    itemType="conversations"
                    itemTypeName="conversation"
                />
            </EditorHeading>

            <Box position={'relative'}>
                <ConversationFlow conversation={conversation} key={JSON.stringify(cloneData(conversation))}
                    openEditor={(branchKey, choiceIndex) => {
                        setOpenBranchId(branchKey)
                        setActiveChoiceIndex(choiceIndex)
                    }}
                    openOrderDialog={(branchKey) => {
                        setEditOrderDialogBranchId(branchKey)
                    }}
                    addNewChoice={addNewChoice}
                    deleteBranch={branchKey => {
                        updateFromPartial(
                            {
                                branches: {
                                    ...cloneData(conversation).branches,
                                    [branchKey]: undefined
                                }
                            },
                            `delete branch "${branchKey}" from ${conversation.id}`
                        )
                    }}
                    changeDefaultBranch={defaultBranch => {
                        if (defaultBranch) {
                            updateFromPartial(
                                { defaultBranch },
                                `change default branch for "${conversation.id}" to ${defaultBranch}`
                            )
                        }
                    }}
                    addNewBranch={addNewBranchAndOpenIt}
                />

                <ActorsInvolvedList boxProps={{
                    position: 'absolute',
                    top: 0
                }}
                    setActorsInvolved={setActorsInvolved}
                    actorsInvolved={actorsInvolved} />
            </Box>

            <Dialog open={!!editOrderDialogBranchId}
                onClose={() => {
                    setEditOrderDialogBranchId(undefined)
                }}
            >
                <DialogTitle>{`Sort choices in branch "${editOrderDialogBranchId}"`}</DialogTitle>

                <DialogContent>
                    {(branchInOrderDialog && editOrderDialogBranchId) &&
                        <ArrayControl horizontalMoveButtons
                            list={branchInOrderDialog.choices}
                            describeItem={(choice) => <ChoiceDescription choice={choice} />}
                            mutateList={newList => {
                                mutateChoiceList(editOrderDialogBranchId, newList)
                            }}
                        />
                    }
                </DialogContent>
            </Dialog>

            <Dialog
                open={!!choice}
                maxWidth={'xl'}
                onClose={() => { setActiveChoiceIndex(undefined) }}
            >
                <DialogTitle>
                    Branch {'"'}{openBranchId}{'"'} : choice #{activeChoiceIndex}
                </DialogTitle>
                <DialogContent>
                    {choice && (<>
                        <ChoiceEditor
                            key={`choice-editor-${openBranchId}-${activeChoiceIndex}`}
                            choice={choice}
                            conversation={conversation}
                            openBranchId={openBranchId ?? ''}
                            {...{
                                addChoiceListItem, removeChoiceListItem, updateChoiceListItem, addSequence,
                                handleChoiceUpdate,
                            }}
                            actorIdsForSequences={actorIdsForSequences}
                        />
                    </>)}
                </DialogContent>
                <DialogActions>
                    {choice?.sequence && (
                        <Button
                            variant="outlined"
                            onClick={() => { setExternalSequenceDialogOpen(true) }}>edit external sequence</Button>
                    )}
                    <Button
                        variant="contained"
                        onClick={() => { setActiveChoiceIndex(undefined) }}>close</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={!!externalSequenceDialogOpen}
                onClose={() => { setExternalSequenceDialogOpen(false) }}
                maxWidth={'xl'}
            >
                {externalSequenceForCurrentChoice && (
                    <DialogContent>
                        <SequenceEditor key={choice.sequence}
                            data={externalSequenceForCurrentChoice}
                            heading='externalSequence'
                        />
                    </DialogContent>
                )}
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={() => { setExternalSequenceDialogOpen(false) }}>close</Button>
                </DialogActions>
            </Dialog>
        </Stack >
    )
}