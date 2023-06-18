import { Conversation, ConversationBranch } from "@/definitions"
import { Box, Button, Stack, Typography, Card } from "@mui/material"
import { Fragment, useEffect, useRef, useState } from "react"
import { LineBetweenNodes } from "./LineBetweenNodes"
import { EditorBox } from "../EditorBox"

interface Props {
    conversation: Conversation
    openEditor: { (branchKey: string, choiceIndex: number): void }
    addNewChoice: { (branchKey: string): void }
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

const getHeirarchy = (conversation: Conversation) => {
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
}

const BranchBox = ({ branch, branchKey, openEditor, addNewChoice }: BranchBoxProps) => {
    return (
        <div data-branch-identifier={branchKey}>
            <EditorBox title={branchKey} >
                {branch.choices.map((choice, index) => (
                    <Box key={index} data-choice-identifier={`${branchKey}-${index}`} marginBottom={1}>
                        <Button onClick={() => { openEditor(branchKey, index) }}>edit</Button>
                        <Typography component={'span'}>
                            {choice.text}
                        </Typography>
                        {choice.end && "👋"}
                    </Box>
                ))}
                <Button onClick={() => { addNewChoice(branchKey) }}>Add new choice</Button>
            </EditorBox>
        </div>)
}


export const ConversationFlow = ({ conversation, openEditor, addNewChoice }: Props) => {
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

    return (<>
        <Typography>Conversation: {id}</Typography>
        <Box
            ref={containerRef} position={'relative'}
        >
            <Card sx={{ padding: 1 }}>
                <Stack spacing={2}>
                    {heirarchy.map((rank, rankIndex) => (
                        <Stack key={rankIndex} direction={'row'} spacing={2} justifyContent={rankIndex === 0 ? 'center' : 'space-between'}>
                            {rank.map(([branchKey, branch], itemIndex) => {
                                return (
                                    <BranchBox
                                        openEditor={openEditor}
                                        addNewChoice={addNewChoice}
                                        key={`${rankIndex}-${itemIndex}`}
                                        branch={branch} branchKey={branchKey} />
                                )
                            })}
                        </Stack>
                    ))}
                </Stack>

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

            </Card>
        </Box >
    </>
    )
}
