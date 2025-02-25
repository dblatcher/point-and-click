import { GameDesignProvider, useGameDesign } from "@/context/game-design-context"
import { cloneData } from "@/lib/clone"
import { gameDesignReducer } from "@/lib/game-design-logic/reducer"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider } from "@mui/material"
import { useReducer, useState } from "react"
import { FlagMapControl } from "./FlagMapControl"
import { GameDesign } from "@/definitions"
import { StartingConditionsForm } from "./StartingConditionsForm"
import { EditorBox } from "./EditorBox"


interface Props {
    sendModifiedDesign: { (gameDesign: GameDesign): void }
}

export const ChangeGameStateDialog = ({ sendModifiedDesign }: Props) => {
    const { gameDesign } = useGameDesign()
    const [dialogOpen, setDialogOpen] = useState(false)

    const [modifiedGameState, dispatchDesignUpdate] = useReducer(gameDesignReducer,
        {
            gameDesign: cloneData(gameDesign),
            history: [],
            undoneHistory: [],
            tabOpen: 'main',
            gameItemIds: {},
        }
    )

    return <>
        <Button onClick={() => setDialogOpen(true)} >state</Button>
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <DialogTitle>Change state: {gameDesign.id}</DialogTitle>
            <DialogContent>
                <GameDesignProvider input={{
                    ...modifiedGameState,
                    dispatchDesignUpdate
                }}>
                    <DialogContentText>This is to change the starting conditions of the game for testing</DialogContentText>
                    <Box display={'flex'} gap={2}>
                        <StartingConditionsForm />
                        <EditorBox title="Flags">
                            <FlagMapControl forModifier />
                        </EditorBox>
                    </Box>
                </GameDesignProvider>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={() => {
                    dispatchDesignUpdate({ type: 'load-new', gameDesign: gameDesign })
                }}>reset</Button>
                <Button variant="contained" onClick={() => {
                    setDialogOpen(false)
                    sendModifiedDesign(modifiedGameState.gameDesign)
                }} >update</Button>
            </DialogActions>
        </Dialog>
    </>
}