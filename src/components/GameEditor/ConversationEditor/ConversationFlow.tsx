import { Conversation, ConversationBranch } from "@/definitions"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import SortIcon from '@mui/icons-material/Sort'
import { Box, Button, Card, IconButton, Stack, Typography } from "@mui/material"
import { Fragment, useEffect, useRef, useState } from "react"
import { ButtonWithConfirm } from "../ButtonWithConfirm"
import { ButtonWithTextInput } from "../ButtonWithTextInput"
import { EditorBox } from "../EditorBox"
import { ChoiceDescription } from "./ChoiceDescription"
import { LineBetweenNodes } from "./LineBetweenNodes"

interface Props {
    conversation: Conversation
    openEditor: { (branchKey: string, choiceIndex: number): void }
    addNewChoice: { (branchKey: string): void }
    openOrderDialog: { (branchKey: string): void }
    deleteBranch: { (branchKey: string): void }
    addNewBranch: { (branchKey: string): void }
}


const assignRanks = (conversation: Conversation): Record<string, number> => {
    const { defaultBranch, id, branches } = conversation;
    const entries = Object.entries(branches);
    const firstBranch = branches[defaultBranch]
    const record: Record<string, number> = {};

    entries.forEach(([branchKey, branch]) => {
        if (branchKey === defaultBranch) {
            record[branchKey] = 0;
            return;
        }
        if (firstBranch?.choices.some(choice => choice.nextBranch === branchKey)) {
            record[branchKey] = 1;
            return;
        }
        record[branchKey] = 2;
    })
    return record
}

const getHeirarchy = (conversation: Conversation): [string, ConversationBranch][][] => {
    const ranks = assignRanks(conversation)
    const entries = Object.entries(conversation.branches);
    const heirarchy: [string, ConversationBranch][][] = [[], [], []]

    entries.forEach(([branchKey, branch]) => {
        const rank = ranks[branchKey]
        if (!branch || typeof rank !== 'number') { return }
        if (!heirarchy[rank]) { heirarchy[rank] = [] }

        heirarchy[rank].push([branchKey, branch])
    })

    return heirarchy
}

const getConnections = (conversation: Conversation): [string, string][] => {
    const connections: [string, string][] = []
    const entries = Object.entries(conversation.branches);
    entries.forEach(([branchKey, branch]) => {
        branch?.choices.forEach((choice, index) => {
            if (choice.nextBranch) {
                connections.push([`${branchKey}-${index}`, choice.nextBranch])
            }
        })
    })
    return connections
}


type BranchBoxProps = {
    branch: ConversationBranch;
    branchKey: string;
    openEditor: { (brandId: string, choiceIndex: number): void };
    addNewChoice: { (branchKey: string): void }
    openOrderDialog: { (branchKey: string): void }
    deleteBranch: { (branchKey: string): void }
}

const BranchBox = ({ branch, branchKey, openEditor, addNewChoice, openOrderDialog, deleteBranch }: BranchBoxProps) => {
    return (
        <div data-branch-identifier={branchKey}>

            <EditorBox
                title={`Branch: ${branchKey}`}
                barContent={
                    <>
                        <IconButton onClick={() => { openOrderDialog(branchKey) }} aria-label="sort choices">
                            <SortIcon />
                        </IconButton>
                        <ButtonWithConfirm useIconButton
                            label={`delete Branch: ${branchKey}`}
                            onClick={() => { deleteBranch(branchKey) }}
                            icon={<DeleteIcon />} />
                    </>
                }
            >
                {branch.choices.map((choice, index) => (
                    <div key={index} data-choice-identifier={`${branchKey}-${index}`}>
                        <ChoiceDescription
                            choice={choice}
                            openEditor={() => { openEditor(branchKey, index) }} />
                    </div>
                ))}
                <Box justifyContent={'flex-end'} display={'flex'}>
                    <Button variant="contained" sx={{
                        paddingX: 2,
                        paddingY: 1,
                    }}
                        startIcon={<AddIcon />}
                        onClick={() => { addNewChoice(branchKey) }}
                    >Add choice</Button>
                </Box>
            </EditorBox>
        </div>)
}


export const ConversationFlow = ({ conversation, openEditor, addNewChoice, openOrderDialog, deleteBranch, addNewBranch }: Props) => {
    const [nodePairs, setNodePairs] = useState<[Element, Element][]>([])
    const containerRef = useRef<HTMLElement>()
    const { id } = conversation
    const heirarchy = getHeirarchy(conversation)


    useEffect(() => {
        const pairs: [Element, Element][] = []
        const connections = getConnections(conversation)
        connections.forEach(connection => {
            const [choiceIdentifier, branchIdentifier] = connection
            const choiceBox = document.querySelector(`[data-choice-identifier=${choiceIdentifier}]`)
            const branchBox = document.querySelector(`[data-branch-identifier=${branchIdentifier}]`)
            if (!!(choiceBox && branchBox)) {
                pairs.push([choiceBox, branchBox])
            }
        })
        setNodePairs(pairs)
    }, [conversation])

    const { current: containerElement } = containerRef

    return (
        <Box
            ref={containerRef} position={'relative'}
        >
            <Card sx={{ padding: 1 }}>
                <Typography>Conversation: {id}</Typography>
                {containerElement && (
                    <Fragment key={JSON.stringify(conversation)}>
                        {nodePairs.map((pair, index) => (
                            <LineBetweenNodes key={index}
                                startNode={pair[0]}
                                endNode={pair[1]}
                                container={containerElement}
                            />
                        ))}
                    </Fragment>
                )}
                <Stack spacing={2}>
                    {heirarchy.map((rank, rankIndex) => (
                        <Stack key={rankIndex}
                            direction={'row'}
                            spacing={2}
                            justifyContent={rankIndex === 0 ? 'center' : 'space-between'}
                            alignItems={'flex-start'}
                        >
                            {rank.map(([branchKey, branch], itemIndex) => {
                                return (
                                    <BranchBox
                                        openEditor={openEditor}
                                        addNewChoice={addNewChoice}
                                        openOrderDialog={openOrderDialog}
                                        deleteBranch={deleteBranch}
                                        key={`${rankIndex}-${itemIndex}`}
                                        branch={branch} branchKey={branchKey} />
                                )
                            })}
                        </Stack>
                    ))}
                </Stack>
                <Box display={'flex'} justifyContent={'flex-end'} paddingTop={2}>
                    <ButtonWithTextInput
                        label="Add Branch"
                        onEntry={(entry) => { addNewBranch(entry) }}
                        confirmationText="enter branch name"
                        buttonProps={{
                            size: 'large',
                            variant: "contained",
                            startIcon: (< AddIcon />),
                        }}
                    />
                </Box>
            </Card>
        </Box>
    )
}
