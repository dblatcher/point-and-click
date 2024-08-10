import { useGameDesign } from "@/context/game-design-context"
import { Interaction } from "@/definitions"
import { Button, Dialog, DialogContent, DialogTitle, Stack, Table, TableBody, TableContainer, TableHead } from "@mui/material"
import React from "react"
import { InteractionTableRow } from "./InteractionTableRow"
import { InteractionTableHeaders } from "./InteractionTableHeaders"
import AddIcon from "@mui/icons-material/Add";

interface Props {
    close: { (): void },
    isOpen: boolean,
    pickIndex: { (index: number | undefined): void }
    criteria: { (interaction: Interaction): boolean }
}


export const PickInteractionDialog: React.FunctionComponent<Props> = ({ close, isOpen, pickIndex, criteria }) => {

    const { gameDesign } = useGameDesign()

    const { interactions } = gameDesign
    const filteredInteractions = interactions.filter(criteria)

    return (
        <Dialog open={isOpen} onClose={close}>
            <DialogTitle>Pick Interaction</DialogTitle>
            <DialogContent>
                <Stack spacing={4}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <InteractionTableHeaders />
                            </TableHead>
                            <TableBody>
                                {interactions.map((interaction, index) => {
                                    if (!filteredInteractions.includes(interaction)) { return <></> }
                                    return (<InteractionTableRow key={index}
                                        interaction={interaction}
                                        index={index}
                                        openEditor={() => { pickIndex(index) }}
                                    />)
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Button sx={{ alignSelf: 'flex-end' }}
                        onClick={() => pickIndex(undefined)}
                        variant="contained"
                        startIcon={<AddIcon />}
                    >create new interaction</Button>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}