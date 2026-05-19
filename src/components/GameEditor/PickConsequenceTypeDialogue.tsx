import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material"
import { ConsequenceType, consequenceTypes, immediateConsequenceTypes } from "point-click-lib"
import { getConsequenceDisplayName, getConsequenceIcon } from "./SequenceEditor/get-order-details"

interface Props {
    immediateOnly?: boolean
    handleChoice: { (consequenceType: ConsequenceType): void }
    open: boolean
    onClose: { (): void }
}

type ConsequenceGrouping = {
    title: string,
    members: ConsequenceType[]
}

const immediateConsequenceGroupings: ConsequenceGrouping[] = [
    {
        title: 'Actors',
        members: [
            'teleportActor',
            'removeActor',
            'setActorPlayable',
        ]
    },
    {
        title: 'Game events',
        members: [
            'conversation',
            'sequence',
            'storyBoardConsequence',
            'changePlayerCharacter',
            'changeRoom',
        ]
    },
    {
        title: 'Sound',
        members: [
            'ambientNoise',
            'backgroundMusic',
            'soundEffect',
        ]
    },
]

const timedConsequenceGroupings: ConsequenceGrouping[] = [{
    title: 'Actor Orders',
    members: [
        'order',
    ]
}]

const allGroups = [...timedConsequenceGroupings, ...immediateConsequenceGroupings]

const ConsequenceIcon = ({ type }: { type: ConsequenceType }) => {
    const Icon = getConsequenceIcon(type)
    return <Icon />
}

const GroupList = ({ group, handleChoice }: { group: ConsequenceGrouping, handleChoice: { (type: ConsequenceType): void } }) => {
    return (
        <Box>
            <Typography>{group.title}</Typography>
            <Box gap={2} display={'flex'} flexWrap={'wrap'} marginBottom={3}>
                {group.members.map(consequenceType => (
                    <Button sx={{ minWidth: "30%" }}
                        key={consequenceType}
                        variant="outlined" color="secondary"
                        onClick={() => handleChoice(consequenceType)}
                        startIcon={<ConsequenceIcon type={consequenceType} />}
                    >{getConsequenceDisplayName(consequenceType)}</Button>
                ))}
            </Box>
        </Box>
    )
}


export const PickConsequenceTypeDialogue = ({ immediateOnly, handleChoice, open, onClose }: Props) => {
    const allowedGroups = immediateOnly ? immediateConsequenceGroupings : allGroups;
    const allTypeNames = immediateOnly ? [...immediateConsequenceTypes] : [...consequenceTypes];
    const unhandledConsequenceTypeNames = allTypeNames
        .filter(consequence =>
            !allowedGroups.some(grouping =>
                grouping.members.includes(consequence)));

    const miscGrouping: ConsequenceGrouping = {
        title: 'Misc',
        members: unhandledConsequenceTypeNames
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Pick Consequence Type</DialogTitle>
            <DialogContent>
                {[...allowedGroups, miscGrouping].map((group, index) => (
                    <GroupList key={index} group={group} handleChoice={handleChoice} />
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>cancel</Button>
            </DialogActions>
        </Dialog>
    )
}