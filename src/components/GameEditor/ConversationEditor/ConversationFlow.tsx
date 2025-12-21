import { AddIcon, DeleteIcon, StarIcon, StarOutlineIcon, SortIcon, ExclamationIcon } from "@/components/GameEditor/material-icons"
import { Conversation, ConversationBranch } from "point-click-lib"
import { Box, Button, IconButton, Stack, Tooltip, useTheme } from "@mui/material"
import Checkbox from '@mui/material/Checkbox'
import { Fragment, useEffect, useRef, useState } from "react"
import { ButtonWithConfirm } from "../ButtonWithConfirm"
import { ButtonWithTextInput } from "../ButtonWithTextInput"
import { EditorBox } from "../layout/EditorBox"
import { formatIdInput } from "../helpers"
import { ChoiceDescription } from "./ChoiceDescription"
import { LineBetweenNodes } from "./LineBetweenNodes"

interface Props {
    conversation: Conversation
    openEditor: { (branchKey: string, choiceIndex: number): void }
    addNewChoice: { (branchKey: string): void }
    openOrderDialog: { (branchKey: string): void }
    deleteBranch: { (branchKey: string): void }
    addNewBranch: { (branchKey: string): void }
    changeDefaultBranch: { (branchKey: string): void }
}

type BranchAndKey = { branchKey: string, branch: ConversationBranch, unreachable?: boolean };

const getHeirarchy = (conversation: Conversation): BranchAndKey[][] => {
    const { defaultBranch, branches } = conversation;
    const defaultBranchData = branches[defaultBranch];

    if (!defaultBranchData) {
        return []
    }

    const heirarchy: BranchAndKey[][] = [[{ branchKey: defaultBranch, branch: defaultBranchData }]]
    let unassignedKeys = Object.keys(conversation.branches).filter(branchKey => branchKey !== defaultBranch);

    const addNextLevel = () => {
        const previousLevel = heirarchy.slice(-1).pop();
        if (!previousLevel) { return }
        const branchesReachableFromPreviousLevel = previousLevel.flatMap(branchInLastLevel => branchInLastLevel.branch.choices.flatMap(choice => choice.nextBranch ?? []))

        const branchesForNewLevel = unassignedKeys.filter(branchKey => branchesReachableFromPreviousLevel.includes(branchKey));
        unassignedKeys = unassignedKeys.filter(branchKey => !branchesForNewLevel.includes(branchKey));

        const newLevel: BranchAndKey[] = branchesForNewLevel
            .flatMap(branchKey => branches[branchKey] ? { branchKey, branch: branches[branchKey] } : [])
        heirarchy.push(newLevel);

        if (unassignedKeys.length === 0) {
            return
        }
        if (newLevel.length > 0) {
            return addNextLevel()
        }
        // not adding more, so dump all the rest in the last level
        const dumpLevel: BranchAndKey[] = unassignedKeys
            .flatMap(branchKey => branches[branchKey] ? { branchKey, branch: branches[branchKey], unreachable: true } : [])
        heirarchy.push(dumpLevel);
    }

    addNextLevel()
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
    isDefaultBranch: boolean
    makeDefault: { (): void }
    unreachable?: boolean
}

const BranchBox = ({ branch, branchKey, openEditor, addNewChoice, openOrderDialog, deleteBranch, isDefaultBranch, makeDefault, unreachable }: BranchBoxProps) => {
    const { palette } = useTheme()
    return (
        <div data-branch-identifier={branchKey}>
            <EditorBox
                boxProps={{minWidth:175}}
                leftContent={
                    <>
                        <Checkbox
                            aria-label="make default branch"
                            onChange={({ target }) => {
                                if (target.checked) {
                                    makeDefault()
                                }
                            }}
                            disabled={isDefaultBranch}
                            checked={isDefaultBranch}
                            icon={<StarOutlineIcon htmlColor={palette.primary.contrastText} />}
                            checkedIcon={<StarIcon htmlColor={palette.primary.contrastText} />}
                        />
                        {unreachable && <Tooltip title={'cannot reach branch'}><ExclamationIcon color="warning" /></Tooltip>}
                    </>
                }
                title={branchKey}
                barContent={
                    <>
                        <IconButton onClick={() => { openOrderDialog(branchKey) }} aria-label="sort choices">
                            <SortIcon />
                        </IconButton>
                        {!isDefaultBranch && (
                            <ButtonWithConfirm useIconButton
                                label={`delete Branch: ${branchKey}`}
                                onClick={() => { deleteBranch(branchKey) }}
                                icon={<DeleteIcon />} />
                        )}
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
                        onClick={() => {
                            addNewChoice(branchKey)
                            openEditor(branchKey, branch.choices.length)
                        }}
                    >Add choice</Button>
                </Box>
            </EditorBox>
        </div>)
}


export const ConversationFlow = ({ conversation, openEditor, addNewChoice, openOrderDialog, deleteBranch, addNewBranch, changeDefaultBranch }: Props) => {
    const [nodePairs, setNodePairs] = useState<[Element, Element][]>([])
    const containerRef = useRef<HTMLElement>()
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
        <Box ref={containerRef}
            marginX={'auto'}
            position={'relative'}
            maxWidth={'lg'} >
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
                        justifyContent={rankIndex === 0 ? 'center' : rankIndex % 2 ? 'space-between' : 'space-around'}
                        alignItems={'flex-start'}
                    >
                        {rank.map(({ branchKey, branch, unreachable }, itemIndex) => {
                            return (
                                <BranchBox
                                    isDefaultBranch={branchKey === conversation.defaultBranch}
                                    makeDefault={() => changeDefaultBranch(branchKey)}
                                    openEditor={openEditor}
                                    addNewChoice={addNewChoice}
                                    openOrderDialog={openOrderDialog}
                                    deleteBranch={deleteBranch}
                                    key={`${rankIndex}-${itemIndex}`}
                                    unreachable={unreachable}
                                    branch={branch} branchKey={branchKey} />
                            )
                        })}
                    </Stack>
                ))}
            </Stack>
            <Box display={'flex'} justifyContent={'center'} paddingTop={4}>
                <ButtonWithTextInput
                    label="Add Branch"
                    onEntry={(entry) => { addNewBranch(entry) }}
                    dialogTitle="enter branch name"
                    modifyInput={formatIdInput}
                    buttonProps={{
                        size: 'large',
                        sx:{padding:20},
                        variant: "contained",
                        startIcon: (< AddIcon />),
                    }}
                />
            </Box>
        </Box>
    )
}
