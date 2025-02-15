import { ConsequenceType } from "@/definitions"
import { consequenceTypes, immediateConsequenceTypes } from "@/definitions/Consequence"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { getConsequenceIcon } from "./SequenceEditor/get-order-details"

interface Props {
    immediateOnly?: boolean
    handleChoice: { (consequenceType: ConsequenceType): void }
    open: boolean
    onClose: { (): void }
}

const ConsequenceIcon = ({ type }: { type: ConsequenceType }) => {
    const Icon = getConsequenceIcon(type)
    return <Icon />
}

export const PickConsequenceTypeDialogue = ({ immediateOnly, handleChoice, open, onClose }: Props) => {
    const flatList = immediateOnly ? [...immediateConsequenceTypes] : [...consequenceTypes];
    const splitList: ConsequenceType[][] = []
    const optionsPerList = immediateOnly ? 5 : 6

    while (flatList.length > 0) {
        splitList.push(flatList.splice(0, optionsPerList))
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Pick Consequence Type</DialogTitle>
            <DialogContent>
                <Box display='flex'>
                    {splitList.map((list, index) =>
                        <List key={index} sx={{ flex: 1 }}>
                            {list.map(type => (
                                <ListItemButton key={type} onClick={() => handleChoice(type)}>
                                    <ListItemIcon><ConsequenceIcon type={type} /></ListItemIcon>
                                    <ListItemText primary={type} />
                                </ListItemButton>
                            ))}
                        </List>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>cancel</Button>
            </DialogActions>
        </Dialog>
    )
}