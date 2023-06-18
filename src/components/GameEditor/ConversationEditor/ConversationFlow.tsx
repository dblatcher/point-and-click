import { Conversation, ConversationBranch } from "@/definitions"
import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { LineBetweenNodes } from "./LineBetweenNodes"

interface Props {
    conversation: Conversation
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

const BranchBox = ({ branch, branchKey }: { branch: ConversationBranch, branchKey: string }) => {
    return <Box sx={{ backgroundColor: 'secondary.light' }} data-branch-identifier={branchKey}>
        <Typography variant="h4">{branchKey}</Typography>
        {branch.choices.map((choice, index) => (
            <Box key={index} data-choice-identifier={`${branchKey}-${index}`} paddingY={1}>
                <Typography component={'span'}>
                    {choice.text}
                </Typography>
                {choice.end && "👋"}
            </Box>
        ))}
    </Box>
}


export const ConversationFlow = ({ conversation }: Props) => {

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
            ref={containerRef}
            sx={{
                border: '1px dotted black',
                position: 'relative',
                minHeight: '20rem',
            }}>

            <Stack spacing={2}>
                {heirarchy.map((rank, rankIndex) => (
                    <Stack key={rankIndex} direction={'row'} spacing={2} justifyContent={'space-around'}>
                        {rank.map(([branchKey, branch], itemIndex) => {
                            return (
                                <BranchBox key={`${rankIndex}-${itemIndex}`} branch={branch} branchKey={branchKey} />
                            )
                        })}
                    </Stack>
                ))}
            </Stack>

            {containerElement && (
                <>
                    {nodePairs.map((pair, index) => (
                        <LineBetweenNodes key={index} 
                            startNode={pair[0]} 
                            endNode={pair[1]} 
                            container={containerElement} 
                        />
                    ))}
                </>
            )}

        </Box >
    </>
    )
}
