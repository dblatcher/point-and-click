import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material"
import { ConsequenceType, consequenceTypes, immediateConsequenceTypes } from "point-click-lib"
import { getConsequenceIcon } from "./SequenceEditor/get-order-details"

interface Props {
    immediateOnly?: boolean
    handleChoice: { (consequenceType: ConsequenceType): void }
    open: boolean
    onClose: { (): void }
}

type ConsequenceGrouping = {
    title: string,
    members: {
        consequence: ConsequenceType,
        displayName?: string
    }[]
}

const groupings: ConsequenceGrouping[] = [
    {
        title: 'Actors',
        members: [
            { consequence: 'teleportActor', displayName: 'teleport' },
            { consequence: 'removeActor', displayName: 'remove' },
            { consequence: 'order', displayName: 'give orders' },
            { consequence: 'setActorPlayable', displayName: 'set playable' },
        ]
    },
    {
        title: 'Game events',
        members: [
            { consequence: 'conversation' },
            { consequence: 'sequence' },
            { consequence: 'storyBoardConsequence', displayName: 'Story Board' },
            { consequence: 'changePlayerCharacter', displayName: 'Player Actor' },
            { consequence: 'changeRoom', displayName: 'change room' },
        ]
    },
    {
        title: 'Sound',
        members: [
            { consequence: 'ambientNoise' },
            { consequence: 'backgroundMusic' },
            { consequence: 'soundEffect', displayName: 'Play SFX' },
        ]
    },
]

const ConsequenceIcon = ({ type }: { type: ConsequenceType }) => {
    const Icon = getConsequenceIcon(type)
    return <Icon />
}

const GroupList = ({ group, handleChoice }: { group: ConsequenceGrouping, handleChoice: { (type: ConsequenceType): void } }) => {
    return (
        <Box>
            <Typography>{group.title}</Typography>
            <Box gap={2} display={'flex'} flexWrap={'wrap'} marginBottom={3}>
                {group.members.map(member => (
                    <Button sx={{ minWidth: "30%" }}
                        key={member.consequence}
                        variant="outlined" color="secondary"
                        onClick={() => handleChoice(member.consequence)}
                        startIcon={<ConsequenceIcon type={member.consequence} />}
                    >{member.displayName ?? member.consequence}</Button>
                ))}
            </Box>
        </Box>
    )
}


export const PickConsequenceTypeDialogue = ({ immediateOnly, handleChoice, open, onClose }: Props) => {
    const fullList = immediateOnly ? [...immediateConsequenceTypes] : [...consequenceTypes];
    const miscConseqences = fullList
        .filter(consequence =>
            !groupings.some(grouping =>
                grouping.members.some(member =>
                    member.consequence === consequence)));

    const miscGrouping: ConsequenceGrouping = {
        title: 'Misc',
        members: miscConseqences.map(consequence => ({ consequence }))
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Pick Consequence Type</DialogTitle>
            <DialogContent>
                {[...groupings, miscGrouping].map((group, index) => (
                    <GroupList key={index} group={group} handleChoice={handleChoice} />
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>cancel</Button>
            </DialogActions>
        </Dialog>
    )
}