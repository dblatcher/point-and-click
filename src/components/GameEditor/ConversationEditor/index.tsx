
import { getModification, type FieldDef, type FieldValue } from "@/components/SchemaForm";
import { useGameDesign } from "@/context/game-design-context";
import { Sequence } from "@/definitions";
import { ChoiceRefSet, Conversation, ConversationBranch, ConversationChoice } from "@/definitions/Conversation";
import { cloneData } from "@/lib/clone";
import { downloadJsonFile } from "@/lib/files";
import { findById, listIds } from "@/lib/util";
import DownloadIcon from '@mui/icons-material/Download';
import { Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import { useState } from "react";
import { ArrayControl } from "../ArrayControl";
import { DeleteDataItemButton } from "../DeleteDataItemButton";
import { EditorHeading } from "../EditorHeading";
import { SequenceEditor } from "../SequenceEditor";
import { makeBlankConversationChoice } from "../defaults";
import { ChoiceDescription } from "./ChoiceDescription";
import { ChoiceEditor } from "./ChoiceEditor";
import { ConversationFlow } from "./ConversationFlow";

type Props = {
    conversation: Conversation;
}

export const ConversationEditor = (props: Props) => {

    const [openBranchId, setOpenBranchId] = useState<string | undefined>(undefined)
    const [activeChoiceIndex, setActiveChoiceIndex] = useState<number | undefined>(0)
    const [sequenceDialogOpen, setSequenceDialogOpen] = useState<boolean>(false)
    const [editOrderDialogBranchId, setEditOrderDialogBranchId] = useState<string | undefined>(undefined)

    const { gameDesign, performUpdate, options } = useGameDesign()
    const { conversations } = gameDesign
    const { conversation } = props

    const updateFromPartial = (input: Partial<Conversation>) => {
        const revisedData = {
            ...cloneData(conversation),
            ...input,
        }
        if (listIds(conversations).includes(conversation.id)) {
            performUpdate('conversations', revisedData)
        }
    }

    const changeValue = (propery: keyof Conversation, newValue: string | number | boolean) => {
        const modification: Partial<Conversation> = {}
        switch (propery) {
            case 'id':
                console.warn("id change passed to ConversationEditor.changeValue", { newValue })
                return;
            case 'currentBranch':
            case 'defaultBranch':
                if (typeof newValue === 'string') {
                    modification[propery] = newValue
                }
                break;
        }
        updateFromPartial(modification)
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

    const handleChoiceChange = (value: FieldValue, field: FieldDef) => {
        const getModifiedBranches = () => {
            const { choice, branches } = getBranchAndChoice()
            if (!choice) { return {} }
            Object.assign(choice, getModification(value, field))
            return { branches }
        }
        updateFromPartial(getModifiedBranches())
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
        updateSequenceData(sequence)
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

    return (
        <Stack component={'article'} spacing={2}>
            <EditorHeading heading={`Conversation Editor`} itemId={conversation.id} />
            <ButtonGroup>
                <Button
                    startIcon={<DownloadIcon />}
                    onClick={(): void => { downloadJsonFile(conversation, 'conversation') }}
                >Save to file</Button>
                <DeleteDataItemButton
                    dataItem={conversation}
                    itemType="conversations"
                    itemTypeName="conversation"
                />
            </ButtonGroup>

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
                        }
                    )
                }}
                changeDefaultBranch={branchKey => {
                    if (branchKey) { changeValue('defaultBranch', branchKey) }
                }}
                addNewBranch={addNewBranchAndOpenIt}
            />

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
                            activeChoiceIndex={activeChoiceIndex ?? -1}
                            {...{
                                handleChoiceChange, addChoiceListItem, removeChoiceListItem, updateChoiceListItem, addSequence
                            }}
                        />
                    </>)}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        disabled={!choice?.sequence}
                        onClick={() => { setSequenceDialogOpen(true) }}>edit sequence</Button>
                    <Button
                        variant="contained"
                        onClick={() => { setActiveChoiceIndex(undefined) }}>close</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={!!sequenceDialogOpen}
                onClose={() => { setSequenceDialogOpen(false) }}
                maxWidth={'xl'}
            >

                {choice && choice.sequence && (
                    <DialogContent>
                        <SequenceEditor key={choice.sequence} isSubSection
                            sequenceId={choice.sequence}
                            data={findById(choice.sequence, gameDesign.sequences)}
                            updateData={(sequence) => {
                                performUpdate('sequences', sequence)
                            }}
                            deleteData={(index) => { console.log('delete squence', index) }}
                            gameDesign={gameDesign}
                            options={options}
                        />
                    </DialogContent>
                )}
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={() => { setSequenceDialogOpen(false) }}>close</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    )
}